/*jslint evil: true, browser: true, immed: true, passfail: true, undef: true, newcap: true*/
/*global Contract */

/**
 * @Class Contract
 * This is the main class for holding the shared methods.
 * @Singleton
 */
Contract = (function(){

    /**
     * @class ContractError
     * @constructor
     * @param {String} message The message
     * @param {String} fileName The name of the file the error occurred in
     * @param {Number} lineNumber The linenumber the error occurred on
     * @return {ContractError} A new instance of the ContractError class
     */
    function ContractError(message, fileName, lineNumber){
        this.message = message;
        this.fileName = fileName;
        this.lineNumber = lineNumber;
    }
    ContractError.prototype = new Error();
    ContractError.prototype.constructor = ContractError;
    ContractError.prototype.name = 'ContractError';
    
    
    function ofType(obj, type){
        return (typeof obj === type);
    }
    
    function getMessage(base, msg){
        return base + ((typeof msg === "undefined") ? "." : (" - '" + msg + "'."));
    }
    
    function instanceOf(arg, type, msg){
        if (!(arg instanceof type)) {
            msg = getMessage("The argument was not an instance of type: " + type.name, msg);
            throw new ContractError(msg);
        }
    }
    
    // These methods are used for preconditions
    function expectType(arg, type, msg){
        var argType = typeof arg;
        if (argType !== type) {
            msg = getMessage("The argument was not of expected type: '" + type + "' - was '" + argType + "'", msg);
            throw new ContractError(msg);
        }
    }
    
    function expect(condition, msg){
        if (!condition) {
            throw new ContractError(getMessage("The required condition was not met", msg));
        }
    }
    function expectObject(arg, msg){
        expectType(arg, "object", msg);
    }
    function expectFunction(arg, msg){
        expectType(arg, "function", msg);
    }
    function expectNumber(arg, msg){
        expectType(arg, "number", msg);
    }
    function expectString(arg, msg){
        expectType(arg, "string", msg);
    }
    function expectRegExp(arg, msg){
        instanceOf(arg, RegExp, msg);
    }
    function expectDOMElement(arg, msg){
        throw new Error("Not implemented");
    }
    
    function expectValue(arg, values, msg){
        if (!values instanceof Array) {
            values = [values];
        }
        var i = values.length;
        while (i--) {
            if (arg === values[i]) {
                return;
            }
        }
        throw new ContractError(getMessage("argument has an invalid value, '" + arg + "' not in '" + values.join() + "'", msg));
    }
    
    function expectWhen(precondition, condition, msg){
        if (precondition) {
            expect(condition, msg);
        }
    }
    
    // These methods are used for postconditions and are only run if the isInstrumented flag is set.
    function guarantees(arg, fn, msg){
        if (!arguments.callee.caller.isInstrumented) {
            return;
        }
        throw new ContractError(getMessage("The return value did not meet the requirements required by '" + fn.toString() + "'", msg));
    }
    function guaranteesObject(arg, msg){
        if (!arguments.callee.caller.isInstrumented) {
            return;
        }
        expectType(arg, "object", msg);
    }
    function guaranteesNumber(arg, msg){
        if (!arguments.callee.caller.isInstrumented) {
            return;
        }
        expectType(arg, "number", msg);
    }
    function guaranteesString(arg, msg){
        if (!arguments.callee.caller.isInstrumented) {
            return;
        }
        expectType(arg, "string", msg);
    }
    function guaranteesRegExp(arg, msg){
        if (!arguments.callee.caller.isInstrumented) {
            return;
        }
        instanceOf(arg, RegExp, msg);
    }
    function guaranteesDOMElement(arg, msg){
        if (!arguments.callee.caller.isInstrumented) {
            return;
        }
        throw new Error("Not implemented");
    }
    
    /**
     * This is the parser that is responsible for parsing the functions and injecting the instrumentation
     */
    var parser = {
        /**
         * The expression used to match named and anonymous functions.
         *  This does not match functions with names staring with a capital as we cannot enforse postconditions on classes.
         */
        reFunction: /^.*\bfunction\b\s?[_$a-zA-Z0-9]*\(/m,
        reLine: /^.+$/m,
        reStatement: /Contract\.\w+((\(\)\;)|(\(.+\)\;)|(\([\s\S]+?\)\;))[\s\S]/,
        /**
         * This mathces the signature of the method eg '()' or '(a,b,c)'.
         */
        reSignature: /\(.*\)/,
        /**
         * This method returns the next complete block.
         * A block is determined by an equal amount of { and }.
         * @return {String} The next block or null
         */
        getBlock: function(){
            var opening = 0, closing = 0, currentPos = this.position, c, l = this.input.length;
            var start = -1, end = 0, prevC;
            while ((opening === 0 || opening > closing) && currentPos < l) {
                c = this.input.substring(currentPos, currentPos + 1);
                switch (c) {
                    case "{":
                        opening++;
                        if (start === -1) {
                            start = currentPos;
                        }
                        break;
                    case "}":
                        closing++;
                        end = currentPos;
                        break;
                    default:
                        if (prevC === "/") {
                            // If we have entered a comment we just skips ahead to the end of it
                            // This way we the parser is not confused by { and } placed in a comment
                            if (c === "/") {
                                currentPos += /$/m.exec(this.input.substring(currentPos)).index;
                            }
                            if (c === "*") {
                                currentPos += /\*\//.exec(this.input.substring(currentPos)).index;
                            }
                        }
                }
                prevC = c;
                currentPos++;
            }
            if (end === 0) {
                return null;
            }
            return this.input.substring(this.position, ++end);
        },
        /**
         * This method will if necessary rewrite the body to allow for instrumentation.
         * This only needed if there is one or more postconditions present.
         * @param {String} body The method body to instrument
         * @return {String} The instrumented body or null if no instrumentation was needed.
         */
        addInstrumentation: function(body){
            var preBlock = "", postBlock = "", statement, doRewrite = false;
            var m = this.reSignature.exec(body), fnSignature = m[0], fnIdentifier = body.substring(0, m.index);
            // Trim the body
            body = body.substring(fnSignature.length + fnIdentifier.length);
            body = body.substring(/^[\w\s].+$/m.exec(body).index, body.lastIndexOf("}"));
            
            //Move Contract.* statements into the pre- and postblock
            while (true) {
                // Read next line
                m = this.reLine.exec(body);
                statement = m[0];
                if (!/Contract\./.test(statement)) {
                    break;
                }
                //get full statement
                m = this.reStatement.exec(body);
                statement = m[0]
                if (/Contract\.expect/.test(statement)) {
                    // A precondition
                    preBlock += statement;
                    body = body.substring(m.index + statement.length + 1);
                    continue;
                }
                if (/Contract\.guarantees/.test(statement)) {
                    // A postcondition
                    doRewrite = true;
                    postBlock += statement.replace("(", "(__return" + ((statement.indexOf("()") === -1) ? ", " : ""));
                    body = body.substring(m.index + statement.length);
                    continue;
                }
            }
            
            if (doRewrite) {
                return fnIdentifier + fnSignature + "{\n" +
                "arguments.callee.isInstrumented = true;\n" +
                "/*@preconditions@*/\n" +
                preBlock +
                "/*@end preconditions@*/\nvar __return = (function" +
                fnSignature +
                "{\n/*@original@*/" +
                body +
                "}" +
                fnSignature +
                ");\n/*@postconditions@*/\n" +
                postBlock +
                "\n/*@end postconditions@*/\nreturn __return;\n}";
            }
            return fnIdentifier + fnSignature +
            "{\n/*@original@*/\n" +
            body +
            "}";
        },
        /**
         * This method iterates over the body until either there is no more functions or the end is reached.
         */
        iterate: function(){
            var oldBody, newBody;
            var string = (this.position === 0) ? this.input : this.input.substring(this.position);
            var m = this.reFunction.exec(string);
            if (m) {
                if (/\/\//.test(m[0])) {
                    // This is commented using //, lets skip to the end
                    this.position += (m.index + m[0].length);
                    return;
                }
                if (/^\s*(\*[^\/])|(\/\*\*)/m.test(m[0])) {
                    // this is part of a multiline comment, lets skip to the end of the comment
                    this.position += /\*\//.exec(string.substring(m.index)).index + 2;
                    return;
                }
                //move the caret to the next function
                this.position += m.index;
                oldBody = this.getBlock();
                if (oldBody) {
                    newBody = this.addInstrumentation(oldBody)
                    //Update the input
                    this.input = this.input.substring(0, this.position) + newBody + this.input.substring(this.position + oldBody.length);
                    //move the caret past the end
                    this.position += newBody.indexOf("/*@original@*/");
                }
                else {
                    this.position = this.input.length;
                }
            }
            else {
                this.position = this.input.length;
            }
        },
        /**
         * This method will instrument a script so that both pre- and postconditions are checked.
         * @param {String} input The script to instrument
         * @return {String} The instrumented script.
         */
        instrument: function(input){
            this.position = 0;
            this.input = input;
            while (this.position !== this.input.length) {
                this.iterate();
            }
            return this.input;
        }
    };
    
    function createXMLHTTPObject(){
        var xmlHttp, XMLHttpFactories = [function(){
            return new ActiveXObject("Microsoft.XMLHTTP");
        }, function(){
            return new ActiveXObject("Msxml3.XMLHTTP");
        }, function(){
            return new ActiveXObject("Msxml2.XMLHTTP");
        }, function(){
            return new XMLHttpRequest();
        }
], i = XMLHttpFactories.length;
        
        if (this._factory) {
            return this._factory();
        }
        while (i--) {
            try {
                xmlHttp = XMLHttpFactories[i]();
                // Use memoization to cache the factory
                this._factory = XMLHttpFactories[i];
                return xmlHttp;
            } 
            catch (e) {
            }
        }
    }
    
    /**
     * This method will try to load a script from the given url and eval it into the document.
     * @param {String} url The path to the script
     * @param {Boolean} instrument If the script should be instrumented before evaling.
     */
    function load(url, instrument, fn){
        var xhrObj = createXMLHTTPObject();
        xhrObj.onreadystatechange = function(){
            if (xhrObj.readyState != 4) {
                return;
            }
            var se = document.createElement('script');
            document.getElementsByTagName('head')[0].appendChild(se);
            se.text = (instrument) ? parser.instrument(xhrObj.responseText) : xhrObj.responseText;
            if (fn) {
                fn();
            }
        };
        xhrObj.open('GET', url, true);
        xhrObj.send('');
    }
    
    // Expose the public signature
    return {
        expect: expect,
        expectWhen: expectWhen,
        expectObject: expectObject,
        expectNumber: expectNumber,
        expectString: expectString,
        expectRegExp: expectRegExp,
        expectValue: expectValue,
        expectFunction: expectFunction,
        
        guarantees: guarantees,
        guaranteesObject: guaranteesObject,
        guaranteesNumber: guaranteesNumber,
        
        instrument: function(input){
            return parser.instrument(input);
        },
        load: load
    };
}());
