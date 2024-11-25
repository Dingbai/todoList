import require$$0$1 from "electron";
import require$$1 from "path";
import require$$0 from "fs";
import require$$0$2 from "util";
import require$$2 from "child_process";
import require$$0$3 from "os";
var main = {};
const { app: app$2, ipcMain: ipcMain$1 } = require$$0$1;
const path$1 = require$$1;
const fs = require$$0.promises;
const USER_DATA_PATH = app$2.getPath("userData");
const BACKUP_FILE = path$1.join(USER_DATA_PATH, "localStorage-backup.json");
function setupDataPersistenceApi$1() {
  ipcMain$1.handle("backup-local-storage", async (_event, data) => {
    try {
      await fs.writeFile(BACKUP_FILE, JSON.stringify(data));
      console.log("备份成功");
      return { success: true, message: "数据备份成功" };
    } catch (error) {
      console.error("备份失败:", error);
      return { success: false, message: `数据备份失败,${error.message}` };
    }
  });
  ipcMain$1.handle("get-backup-path", async () => {
    return BACKUP_FILE;
  });
  ipcMain$1.handle("upload-file", async (_event, path2) => {
    try {
      const fileContent = await fs.readFile(path2, "utf8");
      const jsonData = JSON.parse(fileContent);
      return {
        success: true,
        data: jsonData,
        message: "File uploaded successfully"
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to upload file: ${error.message}`
      };
    }
  });
}
var backup = setupDataPersistenceApi$1;
var pathIsAbsolute = { exports: {} };
function posix(path2) {
  return path2.charAt(0) === "/";
}
function win32(path2) {
  var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
  var result = splitDeviceRe.exec(path2);
  var device = result[1] || "";
  var isUnc = Boolean(device && device.charAt(1) !== ":");
  return Boolean(result[2] || isUnc);
}
pathIsAbsolute.exports = process.platform === "win32" ? win32 : posix;
pathIsAbsolute.exports.posix = posix;
pathIsAbsolute.exports.win32 = win32;
var pathIsAbsoluteExports = pathIsAbsolute.exports;
var registry;
var hasRequiredRegistry;
function requireRegistry() {
  if (hasRequiredRegistry) return registry;
  hasRequiredRegistry = 1;
  var util = require$$0$2, path2 = require$$1, spawn = require$$2.spawn, HKLM = "HKLM", HKCU = "HKCU", HKCR = "HKCR", HKU = "HKU", HKCC = "HKCC", HIVES = [HKLM, HKCU, HKCR, HKU, HKCC], REG_SZ = "REG_SZ", REG_MULTI_SZ = "REG_MULTI_SZ", REG_EXPAND_SZ = "REG_EXPAND_SZ", REG_DWORD = "REG_DWORD", REG_QWORD = "REG_QWORD", REG_BINARY = "REG_BINARY", REG_NONE = "REG_NONE", REG_TYPES = [REG_SZ, REG_MULTI_SZ, REG_EXPAND_SZ, REG_DWORD, REG_QWORD, REG_BINARY, REG_NONE], DEFAULT_VALUE = "", KEY_PATTERN = /(\\[a-zA-Z0-9_\s]+)*/, PATH_PATTERN = /^(HKEY_LOCAL_MACHINE|HKEY_CURRENT_USER|HKEY_CLASSES_ROOT|HKEY_USERS|HKEY_CURRENT_CONFIG)(.*)$/, ITEM_PATTERN = /^(.*)\s(REG_SZ|REG_MULTI_SZ|REG_EXPAND_SZ|REG_DWORD|REG_QWORD|REG_BINARY|REG_NONE)\s+([^\s].*)$/;
  function ProcessUncleanExitError(message, code) {
    if (!(this instanceof ProcessUncleanExitError))
      return new ProcessUncleanExitError(message, code);
    Error.captureStackTrace(this, ProcessUncleanExitError);
    this.__defineGetter__("name", function() {
      return ProcessUncleanExitError.name;
    });
    this.__defineGetter__("message", function() {
      return message;
    });
    this.__defineGetter__("code", function() {
      return code;
    });
  }
  util.inherits(ProcessUncleanExitError, Error);
  function captureOutput(child) {
    var output = { "stdout": "", "stderr": "" };
    child.stdout.on("data", function(data) {
      output["stdout"] += data.toString();
    });
    child.stderr.on("data", function(data) {
      output["stderr"] += data.toString();
    });
    return output;
  }
  function mkErrorMsg(registryCommand, code, output) {
    var stdout = output["stdout"].trim();
    var stderr = output["stderr"].trim();
    var msg = util.format("%s command exited with code %d:\n%s\n%s", registryCommand, code, stdout, stderr);
    return new ProcessUncleanExitError(msg, code);
  }
  function convertArchString(archString) {
    if (archString == "x64") {
      return "64";
    } else if (archString == "x86") {
      return "32";
    } else {
      throw new Error("illegal architecture: " + archString + " (use x86 or x64)");
    }
  }
  function pushArch(args, arch) {
    if (arch) {
      args.push("/reg:" + convertArchString(arch));
    }
  }
  function getRegExePath() {
    if (process.platform === "win32") {
      return path2.join(process.env.windir, "system32", "reg.exe");
    } else {
      return "REG";
    }
  }
  function RegistryItem(host, hive, key, name, type, value, arch) {
    if (!(this instanceof RegistryItem))
      return new RegistryItem(host, hive, key, name, type, value, arch);
    var _host = host, _hive = hive, _key = key, _name = name, _type = type, _value = value, _arch = arch;
    this.__defineGetter__("host", function() {
      return _host;
    });
    this.__defineGetter__("hive", function() {
      return _hive;
    });
    this.__defineGetter__("key", function() {
      return _key;
    });
    this.__defineGetter__("name", function() {
      return _name;
    });
    this.__defineGetter__("type", function() {
      return _type;
    });
    this.__defineGetter__("value", function() {
      return _value;
    });
    this.__defineGetter__("arch", function() {
      return _arch;
    });
  }
  util.inherits(RegistryItem, Object);
  function Registry(options) {
    if (!(this instanceof Registry))
      return new Registry(options);
    var _options = options || {}, _host = "" + (_options.host || ""), _hive = "" + (_options.hive || HKLM), _key = "" + (_options.key || ""), _arch = _options.arch || null;
    this.__defineGetter__("host", function() {
      return _host;
    });
    this.__defineGetter__("hive", function() {
      return _hive;
    });
    this.__defineGetter__("key", function() {
      return _key;
    });
    this.__defineGetter__("path", function() {
      return (_host.length == 0 ? "" : "\\\\" + _host + "\\") + _hive + _key;
    });
    this.__defineGetter__("arch", function() {
      return _arch;
    });
    this.__defineGetter__("parent", function() {
      var i = _key.lastIndexOf("\\");
      return new Registry({
        host: this.host,
        hive: this.hive,
        key: i == -1 ? "" : _key.substring(0, i),
        arch: this.arch
      });
    });
    if (HIVES.indexOf(_hive) == -1)
      throw new Error("illegal hive specified.");
    if (!KEY_PATTERN.test(_key))
      throw new Error("illegal key specified.");
    if (_arch && _arch != "x64" && _arch != "x86")
      throw new Error("illegal architecture specified (use x86 or x64)");
  }
  Registry.HKLM = HKLM;
  Registry.HKCU = HKCU;
  Registry.HKCR = HKCR;
  Registry.HKU = HKU;
  Registry.HKCC = HKCC;
  Registry.HIVES = HIVES;
  Registry.REG_SZ = REG_SZ;
  Registry.REG_MULTI_SZ = REG_MULTI_SZ;
  Registry.REG_EXPAND_SZ = REG_EXPAND_SZ;
  Registry.REG_DWORD = REG_DWORD;
  Registry.REG_QWORD = REG_QWORD;
  Registry.REG_BINARY = REG_BINARY;
  Registry.REG_NONE = REG_NONE;
  Registry.REG_TYPES = REG_TYPES;
  Registry.DEFAULT_VALUE = DEFAULT_VALUE;
  Registry.prototype.values = function values(cb) {
    if (typeof cb !== "function")
      throw new TypeError("must specify a callback");
    var args = ["QUERY", this.path];
    pushArch(args, this.arch);
    var proc = spawn(getRegExePath(), args, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), buffer = "", self = this, error = null;
    var output = captureOutput(proc);
    proc.on("close", function(code) {
      if (error) {
        return;
      } else if (code !== 0) {
        cb(mkErrorMsg("QUERY", code, output), null);
      } else {
        var items = [], result = [], lines = buffer.split("\n"), lineNumber = 0;
        for (var i = 0, l = lines.length; i < l; i++) {
          var line = lines[i].trim();
          if (line.length > 0) {
            if (lineNumber != 0) {
              items.push(line);
            }
            ++lineNumber;
          }
        }
        for (var i = 0, l = items.length; i < l; i++) {
          var match = ITEM_PATTERN.exec(items[i]), name, type, value;
          if (match) {
            name = match[1].trim();
            type = match[2].trim();
            value = match[3];
            result.push(new RegistryItem(self.host, self.hive, self.key, name, type, value, self.arch));
          }
        }
        cb(null, result);
      }
    });
    proc.stdout.on("data", function(data) {
      buffer += data.toString();
    });
    proc.on("error", function(err) {
      error = err;
      cb(err);
    });
    return this;
  };
  Registry.prototype.keys = function keys(cb) {
    if (typeof cb !== "function")
      throw new TypeError("must specify a callback");
    var args = ["QUERY", this.path];
    pushArch(args, this.arch);
    var proc = spawn(getRegExePath(), args, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), buffer = "", self = this, error = null;
    var output = captureOutput(proc);
    proc.on("close", function(code) {
      if (error) {
        return;
      } else if (code !== 0) {
        cb(mkErrorMsg("QUERY", code, output), null);
      }
    });
    proc.stdout.on("data", function(data) {
      buffer += data.toString();
    });
    proc.stdout.on("end", function() {
      var items = [], result = [], lines = buffer.split("\n");
      for (var i = 0, l = lines.length; i < l; i++) {
        var line = lines[i].trim();
        if (line.length > 0) {
          items.push(line);
        }
      }
      for (var i = 0, l = items.length; i < l; i++) {
        var match = PATH_PATTERN.exec(items[i]), key;
        if (match) {
          match[1];
          key = match[2];
          if (key && key !== self.key) {
            result.push(new Registry({
              host: self.host,
              hive: self.hive,
              key,
              arch: self.arch
            }));
          }
        }
      }
      cb(null, result);
    });
    proc.on("error", function(err) {
      error = err;
      cb(err);
    });
    return this;
  };
  Registry.prototype.get = function get(name, cb) {
    if (typeof cb !== "function")
      throw new TypeError("must specify a callback");
    var args = ["QUERY", this.path];
    if (name == "")
      args.push("/ve");
    else
      args = args.concat(["/v", name]);
    pushArch(args, this.arch);
    var proc = spawn(getRegExePath(), args, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), buffer = "", self = this, error = null;
    var output = captureOutput(proc);
    proc.on("close", function(code) {
      if (error) {
        return;
      } else if (code !== 0) {
        cb(mkErrorMsg("QUERY", code, output), null);
      } else {
        var items = [], result = null, lines = buffer.split("\n"), lineNumber = 0;
        for (var i = 0, l = lines.length; i < l; i++) {
          var line = lines[i].trim();
          if (line.length > 0) {
            if (lineNumber != 0) {
              items.push(line);
            }
            ++lineNumber;
          }
        }
        var item = items[items.length - 1] || "", match = ITEM_PATTERN.exec(item), name2, type, value;
        if (match) {
          name2 = match[1].trim();
          type = match[2].trim();
          value = match[3];
          result = new RegistryItem(self.host, self.hive, self.key, name2, type, value, self.arch);
        }
        cb(null, result);
      }
    });
    proc.stdout.on("data", function(data) {
      buffer += data.toString();
    });
    proc.on("error", function(err) {
      error = err;
      cb(err);
    });
    return this;
  };
  Registry.prototype.set = function set(name, type, value, cb) {
    if (typeof cb !== "function")
      throw new TypeError("must specify a callback");
    if (REG_TYPES.indexOf(type) == -1)
      throw Error("illegal type specified.");
    var args = ["ADD", this.path];
    if (name == "")
      args.push("/ve");
    else
      args = args.concat(["/v", name]);
    args = args.concat(["/t", type, "/d", value, "/f"]);
    pushArch(args, this.arch);
    var proc = spawn(getRegExePath(), args, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), error = null;
    var output = captureOutput(proc);
    proc.on("close", function(code) {
      if (error) {
        return;
      } else if (code !== 0) {
        cb(mkErrorMsg("ADD", code, output));
      } else {
        cb(null);
      }
    });
    proc.stdout.on("data", function(data) {
    });
    proc.on("error", function(err) {
      error = err;
      cb(err);
    });
    return this;
  };
  Registry.prototype.remove = function remove(name, cb) {
    if (typeof cb !== "function")
      throw new TypeError("must specify a callback");
    var args = name ? ["DELETE", this.path, "/f", "/v", name] : ["DELETE", this.path, "/f", "/ve"];
    pushArch(args, this.arch);
    var proc = spawn(getRegExePath(), args, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), error = null;
    var output = captureOutput(proc);
    proc.on("close", function(code) {
      if (error) {
        return;
      } else if (code !== 0) {
        cb(mkErrorMsg("DELETE", code, output), null);
      } else {
        cb(null);
      }
    });
    proc.stdout.on("data", function(data) {
    });
    proc.on("error", function(err) {
      error = err;
      cb(err);
    });
    return this;
  };
  Registry.prototype.clear = function clear(cb) {
    if (typeof cb !== "function")
      throw new TypeError("must specify a callback");
    var args = ["DELETE", this.path, "/f", "/va"];
    pushArch(args, this.arch);
    var proc = spawn(getRegExePath(), args, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), error = null;
    var output = captureOutput(proc);
    proc.on("close", function(code) {
      if (error) {
        return;
      } else if (code !== 0) {
        cb(mkErrorMsg("DELETE", code, output), null);
      } else {
        cb(null);
      }
    });
    proc.stdout.on("data", function(data) {
    });
    proc.on("error", function(err) {
      error = err;
      cb(err);
    });
    return this;
  };
  Registry.prototype.erase = Registry.prototype.clear;
  Registry.prototype.destroy = function destroy(cb) {
    if (typeof cb !== "function")
      throw new TypeError("must specify a callback");
    var args = ["DELETE", this.path, "/f"];
    pushArch(args, this.arch);
    var proc = spawn(getRegExePath(), args, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), error = null;
    var output = captureOutput(proc);
    proc.on("close", function(code) {
      if (error) {
        return;
      } else if (code !== 0) {
        cb(mkErrorMsg("DELETE", code, output), null);
      } else {
        cb(null);
      }
    });
    proc.stdout.on("data", function(data) {
    });
    proc.on("error", function(err) {
      error = err;
      cb(err);
    });
    return this;
  };
  Registry.prototype.create = function create(cb) {
    if (typeof cb !== "function")
      throw new TypeError("must specify a callback");
    var args = ["ADD", this.path, "/f"];
    pushArch(args, this.arch);
    var proc = spawn(getRegExePath(), args, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), error = null;
    var output = captureOutput(proc);
    proc.on("close", function(code) {
      if (error) {
        return;
      } else if (code !== 0) {
        cb(mkErrorMsg("ADD", code, output), null);
      } else {
        cb(null);
      }
    });
    proc.stdout.on("data", function(data) {
    });
    proc.on("error", function(err) {
      error = err;
      cb(err);
    });
    return this;
  };
  Registry.prototype.keyExists = function keyExists(cb) {
    this.values(function(err, items) {
      if (err) {
        if (err.code == 1) {
          return cb(null, false);
        }
        return cb(err);
      }
      cb(null, true);
    });
    return this;
  };
  Registry.prototype.valueExists = function valueExists(name, cb) {
    this.get(name, function(err, item) {
      if (err) {
        if (err.code == 1) {
          return cb(null, false);
        }
        return cb(err);
      }
      cb(null, true);
    });
    return this;
  };
  registry = Registry;
  return registry;
}
var AutoLaunchWindows;
var hasRequiredAutoLaunchWindows;
function requireAutoLaunchWindows() {
  if (hasRequiredAutoLaunchWindows) return AutoLaunchWindows;
  hasRequiredAutoLaunchWindows = 1;
  var Winreg, fs2, path2, regKey;
  fs2 = require$$0;
  path2 = require$$1;
  Winreg = requireRegistry();
  regKey = new Winreg({
    hive: Winreg.HKCU,
    key: "\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
  });
  AutoLaunchWindows = {
    /* Public */
    enable: function(arg) {
      var appName, appPath, isHiddenOnLaunch;
      appName = arg.appName, appPath = arg.appPath, isHiddenOnLaunch = arg.isHiddenOnLaunch;
      return new Promise(function(resolve, reject) {
        var args, pathToAutoLaunchedApp, ref, updateDotExe;
        pathToAutoLaunchedApp = appPath;
        args = "";
        updateDotExe = path2.join(path2.dirname(process.execPath), "..", "update.exe");
        if (((ref = process.versions) != null ? ref.electron : void 0) != null && fs2.existsSync(updateDotExe)) {
          pathToAutoLaunchedApp = updateDotExe;
          args = ' --processStart "' + path2.basename(process.execPath) + '"';
          if (isHiddenOnLaunch) {
            args += ' --process-start-args "--hidden"';
          }
        } else {
          if (isHiddenOnLaunch) {
            args += " --hidden";
          }
        }
        return regKey.set(appName, Winreg.REG_SZ, '"' + pathToAutoLaunchedApp + '"' + args, function(err) {
          if (err != null) {
            return reject(err);
          }
          return resolve();
        });
      });
    },
    disable: function(appName) {
      return new Promise(function(resolve, reject) {
        return regKey.remove(appName, function(err) {
          if (err != null) {
            if (err.message.indexOf("The system was unable to find the specified registry key or value") !== -1) {
              return resolve(false);
            }
            return reject(err);
          }
          return resolve();
        });
      });
    },
    isEnabled: function(appName) {
      return new Promise(function(resolve, reject) {
        return regKey.get(appName, function(err, item) {
          if (err != null) {
            return resolve(false);
          }
          return resolve(item != null);
        });
      });
    }
  };
  return AutoLaunchWindows;
}
var applescript = {};
var applescriptParser = {};
var hasRequiredApplescriptParser;
function requireApplescriptParser() {
  if (hasRequiredApplescriptParser) return applescriptParser;
  hasRequiredApplescriptParser = 1;
  (function(exports) {
    exports.parse = function(str) {
      if (str.length == 0) {
        return;
      }
      var rtn = parseFromFirstRemaining.call({
        value: str,
        index: 0
      });
      return rtn;
    };
    function parseFromFirstRemaining() {
      var cur = this.value[this.index];
      switch (cur) {
        case "{":
          return exports.ArrayParser.call(this);
        case '"':
          return exports.StringParser.call(this);
        case "a":
          if (this.value.substring(this.index, this.index + 5) == "alias") {
            return exports.AliasParser.call(this);
          }
          break;
        case "«":
          if (this.value.substring(this.index, this.index + 5) == "«data") {
            return exports.DataParser.call(this);
          }
          break;
      }
      if (!isNaN(cur)) {
        return exports.NumberParser.call(this);
      }
      return exports.UndefinedParser.call(this);
    }
    exports.AliasParser = function() {
      this.index += 6;
      return "/Volumes/" + exports.StringParser.call(this).replace(/:/g, "/");
    };
    exports.ArrayParser = function() {
      var rtn = [], cur = this.value[++this.index];
      while (cur != "}") {
        rtn.push(parseFromFirstRemaining.call(this));
        if (this.value[this.index] == ",") this.index += 2;
        cur = this.value[this.index];
      }
      this.index++;
      return rtn;
    };
    exports.DataParser = function() {
      var body = exports.UndefinedParser.call(this);
      body = body.substring(6, body.length - 1);
      var type = body.substring(0, 4);
      body = body.substring(4, body.length);
      var buf = new Buffer(body.length / 2);
      var count = 0;
      for (var i = 0, l = body.length; i < l; i += 2) {
        buf[count++] = parseInt(body[i] + body[i + 1], 16);
      }
      buf.type = type;
      return buf;
    };
    exports.NumberParser = function() {
      return Number(exports.UndefinedParser.call(this));
    };
    exports.StringParser = function(str) {
      var rtn = "", end = ++this.index, cur = this.value[end++];
      while (cur != '"') {
        if (cur == "\\") {
          rtn += this.value.substring(this.index, end - 1);
          this.index = end++;
        }
        cur = this.value[end++];
      }
      rtn += this.value.substring(this.index, end - 1);
      this.index = end;
      return rtn;
    };
    var END_OF_TOKEN = /}|,|\n/;
    exports.UndefinedParser = function() {
      var end = this.index, cur = this.value[end++];
      while (!END_OF_TOKEN.test(cur)) {
        cur = this.value[end++];
      }
      var rtn = this.value.substring(this.index, end - 1);
      this.index = end - 1;
      return rtn;
    };
  })(applescriptParser);
  return applescriptParser;
}
var hasRequiredApplescript;
function requireApplescript() {
  if (hasRequiredApplescript) return applescript;
  hasRequiredApplescript = 1;
  (function(exports) {
    var spawn = require$$2.spawn;
    exports.Parsers = requireApplescriptParser();
    var parse = exports.Parsers.parse;
    exports.osascript = "osascript";
    exports.execFile = function execFile(file, args, callback) {
      if (!Array.isArray(args)) {
        callback = args;
        args = [];
      }
      return runApplescript(file, args, callback);
    };
    exports.execString = function execString(str, callback) {
      return runApplescript(str, callback);
    };
    function runApplescript(strOrPath, args, callback) {
      var isString = false;
      if (!Array.isArray(args)) {
        callback = args;
        args = [];
        isString = true;
      }
      args.push("-ss");
      if (!isString) {
        args.push(strOrPath);
      }
      var interpreter = spawn(exports.osascript, args);
      bufferBody(interpreter.stdout);
      bufferBody(interpreter.stderr);
      interpreter.on("exit", function(code) {
        var result = parse(interpreter.stdout.body);
        var err;
        if (code) {
          err = new Error(interpreter.stderr.body);
          err.appleScript = strOrPath;
          err.exitCode = code;
        }
        if (callback) {
          callback(err, result, interpreter.stderr.body);
        }
      });
      if (isString) {
        interpreter.stdin.write(strOrPath);
        interpreter.stdin.end();
      }
    }
    function bufferBody(stream) {
      stream.body = "";
      stream.setEncoding("utf8");
      stream.on("data", function(chunk) {
        stream.body += chunk;
      });
    }
  })(applescript);
  return applescript;
}
var untildify;
var hasRequiredUntildify;
function requireUntildify() {
  if (hasRequiredUntildify) return untildify;
  hasRequiredUntildify = 1;
  const home = require$$0$3.homedir();
  untildify = (str) => {
    if (typeof str !== "string") {
      throw new TypeError(`Expected a string, got ${typeof str}`);
    }
    return home ? str.replace(/^~(?=$|\/|\\)/, home) : str;
  };
  return untildify;
}
var mkdirp;
var hasRequiredMkdirp;
function requireMkdirp() {
  if (hasRequiredMkdirp) return mkdirp;
  hasRequiredMkdirp = 1;
  var path2 = require$$1;
  var fs2 = require$$0;
  var _0777 = parseInt("0777", 8);
  mkdirp = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;
  function mkdirP(p, opts, f, made) {
    if (typeof opts === "function") {
      f = opts;
      opts = {};
    } else if (!opts || typeof opts !== "object") {
      opts = { mode: opts };
    }
    var mode = opts.mode;
    var xfs = opts.fs || fs2;
    if (mode === void 0) {
      mode = _0777;
    }
    if (!made) made = null;
    var cb = f || /* istanbul ignore next */
    function() {
    };
    p = path2.resolve(p);
    xfs.mkdir(p, mode, function(er) {
      if (!er) {
        made = made || p;
        return cb(null, made);
      }
      switch (er.code) {
        case "ENOENT":
          if (path2.dirname(p) === p) return cb(er);
          mkdirP(path2.dirname(p), opts, function(er2, made2) {
            if (er2) cb(er2, made2);
            else mkdirP(p, opts, cb, made2);
          });
          break;
        default:
          xfs.stat(p, function(er2, stat) {
            if (er2 || !stat.isDirectory()) cb(er, made);
            else cb(null, made);
          });
          break;
      }
    });
  }
  mkdirP.sync = function sync(p, opts, made) {
    if (!opts || typeof opts !== "object") {
      opts = { mode: opts };
    }
    var mode = opts.mode;
    var xfs = opts.fs || fs2;
    if (mode === void 0) {
      mode = _0777;
    }
    if (!made) made = null;
    p = path2.resolve(p);
    try {
      xfs.mkdirSync(p, mode);
      made = made || p;
    } catch (err0) {
      switch (err0.code) {
        case "ENOENT":
          made = sync(path2.dirname(p), opts, made);
          sync(p, opts, made);
          break;
        default:
          var stat;
          try {
            stat = xfs.statSync(p);
          } catch (err1) {
            throw err0;
          }
          if (!stat.isDirectory()) throw err0;
          break;
      }
    }
    return made;
  };
  return mkdirp;
}
var fileBasedUtilities;
var hasRequiredFileBasedUtilities;
function requireFileBasedUtilities() {
  if (hasRequiredFileBasedUtilities) return fileBasedUtilities;
  hasRequiredFileBasedUtilities = 1;
  var fs2, mkdirp2;
  fs2 = require$$0;
  mkdirp2 = requireMkdirp();
  fileBasedUtilities = {
    /* Public */
    createFile: function(arg) {
      var data, directory, filePath;
      directory = arg.directory, filePath = arg.filePath, data = arg.data;
      return new Promise(function(resolve, reject) {
        return mkdirp2(directory, function(mkdirErr) {
          if (mkdirErr != null) {
            return reject(mkdirErr);
          }
          return fs2.writeFile(filePath, data, function(writeErr) {
            if (writeErr != null) {
              return reject(writeErr);
            }
            return resolve();
          });
        });
      });
    },
    isEnabled: function(filePath) {
      return new Promise(/* @__PURE__ */ function(_this) {
        return function(resolve, reject) {
          return fs2.stat(filePath, function(err, stat) {
            if (err != null) {
              return resolve(false);
            }
            return resolve(stat != null);
          });
        };
      }());
    },
    removeFile: function(filePath) {
      return new Promise(/* @__PURE__ */ function(_this) {
        return function(resolve, reject) {
          return fs2.stat(filePath, function(statErr) {
            if (statErr != null) {
              return resolve();
            }
            return fs2.unlink(filePath, function(unlinkErr) {
              if (unlinkErr != null) {
                return reject(unlinkErr);
              }
              return resolve();
            });
          });
        };
      }());
    }
  };
  return fileBasedUtilities;
}
var AutoLaunchMac;
var hasRequiredAutoLaunchMac;
function requireAutoLaunchMac() {
  if (hasRequiredAutoLaunchMac) return AutoLaunchMac;
  hasRequiredAutoLaunchMac = 1;
  var applescript2, fileBasedUtilities2, untildify2, indexOf = [].indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item) return i;
    }
    return -1;
  };
  applescript2 = requireApplescript();
  untildify2 = requireUntildify();
  fileBasedUtilities2 = requireFileBasedUtilities();
  AutoLaunchMac = {
    /* Public */
    enable: function(arg) {
      var appName, appPath, data, isHiddenOnLaunch, isHiddenValue, mac, programArguments, programArgumentsSection, properties;
      appName = arg.appName, appPath = arg.appPath, isHiddenOnLaunch = arg.isHiddenOnLaunch, mac = arg.mac;
      if (mac.useLaunchAgent) {
        programArguments = [appPath];
        if (isHiddenOnLaunch) {
          programArguments.push("--hidden");
        }
        programArgumentsSection = programArguments.map(function(argument) {
          return "    <string>" + argument + "</string>";
        }).join("\n");
        data = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n  <key>Label</key>\n  <string>' + appName + "</string>\n  <key>ProgramArguments</key>\n  <array>\n  " + programArgumentsSection + "\n  </array>\n  <key>RunAtLoad</key>\n  <true/>\n</dict>\n</plist>";
        return fileBasedUtilities2.createFile({
          data,
          directory: this.getDirectory(),
          filePath: this.getFilePath(appName)
        });
      }
      isHiddenValue = isHiddenOnLaunch ? "true" : "false";
      properties = '{path:"' + appPath + '", hidden:' + isHiddenValue + ', name:"' + appName + '"}';
      return this.execApplescriptCommand("make login item at end with properties " + properties);
    },
    disable: function(appName, mac) {
      if (mac.useLaunchAgent) {
        return fileBasedUtilities2.removeFile(this.getFilePath(appName));
      }
      return this.execApplescriptCommand('delete login item "' + appName + '"');
    },
    isEnabled: function(appName, mac) {
      if (mac.useLaunchAgent) {
        return fileBasedUtilities2.isEnabled(this.getFilePath(appName));
      }
      return this.execApplescriptCommand("get the name of every login item").then(function(loginItems) {
        return loginItems != null && indexOf.call(loginItems, appName) >= 0;
      });
    },
    /* Private */
    execApplescriptCommand: function(commandSuffix) {
      return new Promise(function(resolve, reject) {
        return applescript2.execString('tell application "System Events" to ' + commandSuffix, function(err, result) {
          if (err != null) {
            return reject(err);
          }
          return resolve(result);
        });
      });
    },
    getDirectory: function() {
      return untildify2("~/Library/LaunchAgents/");
    },
    getFilePath: function(appName) {
      return "" + this.getDirectory() + appName + ".plist";
    }
  };
  return AutoLaunchMac;
}
var AutoLaunchLinux;
var hasRequiredAutoLaunchLinux;
function requireAutoLaunchLinux() {
  if (hasRequiredAutoLaunchLinux) return AutoLaunchLinux;
  hasRequiredAutoLaunchLinux = 1;
  var fileBasedUtilities2, untildify2;
  untildify2 = requireUntildify();
  fileBasedUtilities2 = requireFileBasedUtilities();
  AutoLaunchLinux = {
    /* Public */
    enable: function(arg) {
      var appName, appPath, data, hiddenArg, isHiddenOnLaunch;
      appName = arg.appName, appPath = arg.appPath, isHiddenOnLaunch = arg.isHiddenOnLaunch;
      hiddenArg = isHiddenOnLaunch ? " --hidden" : "";
      data = "[Desktop Entry]\nType=Application\nVersion=1.0\nName=" + appName + "\nComment=" + appName + "startup script\nExec=" + appPath + hiddenArg + "\nStartupNotify=false\nTerminal=false";
      return fileBasedUtilities2.createFile({
        data,
        directory: this.getDirectory(),
        filePath: this.getFilePath(appName)
      });
    },
    disable: function(appName) {
      return fileBasedUtilities2.removeFile(this.getFilePath(appName));
    },
    isEnabled: function(appName) {
      return fileBasedUtilities2.isEnabled(this.getFilePath(appName));
    },
    /* Private */
    getDirectory: function() {
      return untildify2("~/.config/autostart/");
    },
    getFilePath: function(appName) {
      return "" + this.getDirectory() + appName + ".desktop";
    }
  };
  return AutoLaunchLinux;
}
var isPathAbsolute, bind = function(fn, me) {
  return function() {
    return fn.apply(me, arguments);
  };
};
isPathAbsolute = pathIsAbsoluteExports;
var dist = function() {
  function AutoLaunch2(arg) {
    var isHidden, mac, name, path2, versions;
    name = arg.name, isHidden = arg.isHidden, mac = arg.mac, path2 = arg.path;
    this.fixOpts = bind(this.fixOpts, this);
    this.isEnabled = bind(this.isEnabled, this);
    this.disable = bind(this.disable, this);
    this.enable = bind(this.enable, this);
    if (name == null) {
      throw new Error("You must specify a name");
    }
    this.opts = {
      appName: name,
      isHiddenOnLaunch: isHidden != null ? isHidden : false,
      mac: mac != null ? mac : {}
    };
    versions = typeof process !== "undefined" && process !== null ? process.versions : void 0;
    if (path2 != null) {
      if (!isPathAbsolute(path2)) {
        throw new Error("path must be absolute");
      }
      this.opts.appPath = path2;
    } else if (versions != null && (versions.nw != null || versions["node-webkit"] != null || versions.electron != null)) {
      this.opts.appPath = process.execPath;
    } else {
      throw new Error("You must give a path (this is only auto-detected for NW.js and Electron apps)");
    }
    this.fixOpts();
    this.api = null;
    if (/^win/.test(process.platform)) {
      this.api = requireAutoLaunchWindows();
    } else if (/darwin/.test(process.platform)) {
      this.api = requireAutoLaunchMac();
    } else if (/linux/.test(process.platform) || /freebsd/.test(process.platform)) {
      this.api = requireAutoLaunchLinux();
    } else {
      throw new Error("Unsupported platform");
    }
  }
  AutoLaunch2.prototype.enable = function() {
    return this.api.enable(this.opts);
  };
  AutoLaunch2.prototype.disable = function() {
    return this.api.disable(this.opts.appName, this.opts.mac);
  };
  AutoLaunch2.prototype.isEnabled = function() {
    return this.api.isEnabled(this.opts.appName, this.opts.mac);
  };
  AutoLaunch2.prototype.fixMacExecPath = function(path2, macOptions) {
    path2 = path2.replace(/(^.+?[^\/]+?\.app)\/Contents\/(Frameworks\/((\1|[^\/]+?) Helper)\.app\/Contents\/MacOS\/\3|MacOS\/Electron)/, "$1");
    if (!macOptions.useLaunchAgent) {
      path2 = path2.replace(/\.app\/Contents\/MacOS\/[^\/]*$/, ".app");
    }
    return path2;
  };
  AutoLaunch2.prototype.fixOpts = function() {
    var tempPath;
    this.opts.appPath = this.opts.appPath.replace(/\/$/, "");
    if (/darwin/.test(process.platform)) {
      this.opts.appPath = this.fixMacExecPath(this.opts.appPath, this.opts.mac);
    }
    if (this.opts.appPath.indexOf("/") !== -1) {
      tempPath = this.opts.appPath.split("/");
      this.opts.appName = tempPath[tempPath.length - 1];
    } else if (this.opts.appPath.indexOf("\\") !== -1) {
      tempPath = this.opts.appPath.split("\\");
      this.opts.appName = tempPath[tempPath.length - 1];
      this.opts.appName = this.opts.appName.substr(0, this.opts.appName.length - ".exe".length);
    }
    if (/darwin/.test(process.platform)) {
      if (this.opts.appName.indexOf(".app", this.opts.appName.length - ".app".length) !== -1) {
        return this.opts.appName = this.opts.appName.substr(0, this.opts.appName.length - ".app".length);
      }
    }
  };
  return AutoLaunch2;
}();
const { app: app$1, ipcMain } = require$$0$1;
const AutoLaunch = dist;
class AutoLaunchManager {
  constructor(options = {}) {
    this.appName = options.appName || app$1.getName();
    this.isHidden = options.isHidden || false;
    this.autoLauncher = new AutoLaunch({
      name: this.appName,
      path: app$1.getPath("exe"),
      isHidden: this.isHidden
    });
    this.isEnabled = false;
  }
  // 初始化并检查当前状态
  async init() {
    try {
      this.isEnabled = await this.autoLauncher.isEnabled();
      return this.isEnabled;
    } catch (error) {
      console.error("检查自启动状态失败:", error);
      return false;
    }
  }
  // 启用自启动
  async enable() {
    try {
      if (!this.isEnabled) {
        await this.autoLauncher.enable();
        this.isEnabled = true;
      }
      return true;
    } catch (error) {
      console.error("启用自启动失败:", error);
      return false;
    }
  }
  // 禁用自启动
  async disable() {
    try {
      if (this.isEnabled) {
        await this.autoLauncher.disable();
        this.isEnabled = false;
      }
      return true;
    } catch (error) {
      console.error("禁用自启动失败:", error);
      return false;
    }
  }
  // 切换自启动状态
  async toggle(state) {
    try {
      console.log("state :>> ", state);
      if (state) {
        await this.enable();
      } else {
        await this.disable();
      }
      return { success: true, message: "切换自启动状态成功" };
    } catch (e) {
      return { success: false, message: e };
    }
  }
  // 获取当前状态
  getState() {
    return this.isEnabled;
  }
}
async function AutoLaunchManagerApi$1() {
  const autoLaunch = new AutoLaunchManager({
    appName: "todoList",
    // 可选，默认使用 app.getName()
    isHidden: false
    // 可选，是否隐藏窗口启动
  });
  await autoLaunch.init();
  ipcMain.handle("toggle-auto-launch", async (_event, state) => {
    console.log("autoLaunch.getState() :>> ", autoLaunch.getState());
    return await autoLaunch.toggle(state);
  });
  ipcMain.handle("get-auto-launch-state", () => {
    return autoLaunch.getState();
  });
}
var autoLaunchManager = AutoLaunchManagerApi$1;
const { app, BrowserWindow, globalShortcut } = require$$0$1;
const setupDataPersistenceApi = backup;
const AutoLaunchManagerApi = autoLaunchManager;
const path = require$$1;
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1e3,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "api/preload.cjs")
    },
    webContents: {
      openDevTools: true
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
}
app.whenReady().then(async () => {
  createWindow();
  setupDataPersistenceApi();
  AutoLaunchManagerApi();
  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  globalShortcut.register("CommandOrControl+Shift+I", () => {
    BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
  });
});
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});
export {
  main as default
};
