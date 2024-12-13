if (process.env.NODE_ENV === 'development') {
    const chalk = require('chalk');
  
    const logStyles = {
      log: chalk.blueBright,
      warn: chalk.yellow,
      error: chalk.red,
      debug: chalk.green,
    };
  
    // function getCallerInfo() {
    //   const stack = new Error().stack;
    //   const callerLine = stack.split("\n")[3];
    //   const match = callerLine.match(/\((.*):(\d+):(\d+)\)/);
    //   if (match) {
    //     const filePath = match[1];
    //     const fileName = filePath.split('/').pop();
    //     const lineNumber = match[2];
    //     return `${fileName}:${lineNumber}`;
    //   }
    //   return 'unknown';
    // }
  

    function getCallerInfo() {
        const stack = new Error().stack;
      
        // Split stack trace into lines
        const stackLines = stack.split("\n");
      
        // Find the first line outside of 'devLogger.js'
        const callerLine = stackLines.find(
          line => !line.includes('devLogger.js') && line.includes('at ')
        );
      
        if (callerLine) {
          // Match file path, line number, and column
          const match = callerLine.match(/at .* \((.*):(\d+):(\d+)\)/) || 
                        callerLine.match(/at (.*):(\d+):(\d+)/);
      
          if (match) {
            const filePath = match[1];
            const fileName = filePath.split('/').pop();
            const lineNumber = match[2];
            return `${fileName}:${lineNumber}`;
          }
        }
      
        return 'unknown';
      }
      

    global.dev = {
      log(message, data = null) {
        this.print('log', message, data);
      },
      warn(message, data = null) {
        this.print('warn', message, data);
      },
      error(message, data = null) {
        this.print('error', message, data);
      },
      debug(message, data = null) {
        this.print('debug', message, data);
      },
      print(level, message, data) {
        const timestamp = new Date().toISOString();
        const color = logStyles[level] || chalk.white;
        const callerInfo = getCallerInfo();
  
        const formattedMessage = `${color(`[${level.toUpperCase()}]`)} ${callerInfo}: ${message}`;
        const formattedData = data ? `\n${chalk.magentaBright(JSON.stringify(data, null, 2))}` : '';
        console.log(`${formattedMessage}${formattedData}`);
      },
    };
  } else {
    global.dev = {
      log: () => {},
      warn: () => {},
      error: () => {},
      debug: () => {},
    };
  }
  