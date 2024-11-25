import B from "electron";
import K from "path";
import j from "fs";
import He from "util";
import be from "child_process";
import Ce from "os";
var ft = {};
const { app: Fe, ipcMain: V } = B, $e = K, fe = j.promises, Me = Fe.getPath("userData"), pe = $e.join(Me, "localStorage-backup.json");
function Ie() {
  V.handle("backup-local-storage", async (t, r) => {
    try {
      return await fe.writeFile(pe, JSON.stringify(r)), console.log("备份成功"), { success: !0, message: "数据备份成功" };
    } catch (a) {
      return console.error("备份失败:", a), { success: !1, message: `数据备份失败,${a.message}` };
    }
  }), V.handle("get-backup-path", async () => pe), V.handle("upload-file", async (t, r) => {
    try {
      const a = await fe.readFile(r, "utf8");
      return {
        success: !0,
        data: JSON.parse(a),
        message: "File uploaded successfully"
      };
    } catch (a) {
      return {
        success: !1,
        message: `Failed to upload file: ${a.message}`
      };
    }
  });
}
var qe = Ie, Z = { exports: {} };
function Le(t) {
  return t.charAt(0) === "/";
}
function De(t) {
  var r = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/, a = r.exec(t), i = a[1] || "", n = !!(i && i.charAt(1) !== ":");
  return !!(a[2] || n);
}
Z.exports = process.platform === "win32" ? De : Le;
Z.exports.posix = Le;
Z.exports.win32 = De;
var Ke = Z.exports, Q, he;
function Ye() {
  if (he) return Q;
  he = 1;
  var t = He, r = K, a = be.spawn, i = "HKLM", n = "HKCU", e = "HKCR", s = "HKU", o = "HKCC", d = [i, n, e, s, o], _ = "REG_SZ", y = "REG_MULTI_SZ", w = "REG_EXPAND_SZ", R = "REG_DWORD", b = "REG_QWORD", U = "REG_BINARY", ae = "REG_NONE", oe = [_, y, w, R, b, U, ae], Ge = "", ke = /(\\[a-zA-Z0-9_\s]+)*/, Oe = /^(HKEY_LOCAL_MACHINE|HKEY_CURRENT_USER|HKEY_CLASSES_ROOT|HKEY_USERS|HKEY_CURRENT_CONFIG)(.*)$/, ue = /^(.*)\s(REG_SZ|REG_MULTI_SZ|REG_EXPAND_SZ|REG_DWORD|REG_QWORD|REG_BINARY|REG_NONE)\s+([^\s].*)$/;
  function F(E, u) {
    if (!(this instanceof F))
      return new F(E, u);
    Error.captureStackTrace(this, F), this.__defineGetter__("name", function() {
      return F.name;
    }), this.__defineGetter__("message", function() {
      return E;
    }), this.__defineGetter__("code", function() {
      return u;
    });
  }
  t.inherits(F, Error);
  function T(E) {
    var u = { stdout: "", stderr: "" };
    return E.stdout.on("data", function(l) {
      u.stdout += l.toString();
    }), E.stderr.on("data", function(l) {
      u.stderr += l.toString();
    }), u;
  }
  function G(E, u, l) {
    var c = l.stdout.trim(), p = l.stderr.trim(), h = t.format(`%s command exited with code %d:
%s
%s`, E, u, c, p);
    return new F(h, u);
  }
  function Ue(E) {
    if (E == "x64")
      return "64";
    if (E == "x86")
      return "32";
    throw new Error("illegal architecture: " + E + " (use x86 or x64)");
  }
  function k(E, u) {
    u && E.push("/reg:" + Ue(u));
  }
  function O() {
    return process.platform === "win32" ? r.join(process.env.windir, "system32", "reg.exe") : "REG";
  }
  function M(E, u, l, c, p, h, f) {
    if (!(this instanceof M))
      return new M(E, u, l, c, p, h, f);
    var A = E, g = u, m = l, L = c, P = p, D = h, x = f;
    this.__defineGetter__("host", function() {
      return A;
    }), this.__defineGetter__("hive", function() {
      return g;
    }), this.__defineGetter__("key", function() {
      return m;
    }), this.__defineGetter__("name", function() {
      return L;
    }), this.__defineGetter__("type", function() {
      return P;
    }), this.__defineGetter__("value", function() {
      return D;
    }), this.__defineGetter__("arch", function() {
      return x;
    });
  }
  t.inherits(M, Object);
  function v(E) {
    if (!(this instanceof v))
      return new v(E);
    var u = E || {}, l = "" + (u.host || ""), c = "" + (u.hive || i), p = "" + (u.key || ""), h = u.arch || null;
    if (this.__defineGetter__("host", function() {
      return l;
    }), this.__defineGetter__("hive", function() {
      return c;
    }), this.__defineGetter__("key", function() {
      return p;
    }), this.__defineGetter__("path", function() {
      return (l.length == 0 ? "" : "\\\\" + l + "\\") + c + p;
    }), this.__defineGetter__("arch", function() {
      return h;
    }), this.__defineGetter__("parent", function() {
      var f = p.lastIndexOf("\\");
      return new v({
        host: this.host,
        hive: this.hive,
        key: f == -1 ? "" : p.substring(0, f),
        arch: this.arch
      });
    }), d.indexOf(c) == -1)
      throw new Error("illegal hive specified.");
    if (!ke.test(p))
      throw new Error("illegal key specified.");
    if (h && h != "x64" && h != "x86")
      throw new Error("illegal architecture specified (use x86 or x64)");
  }
  return v.HKLM = i, v.HKCU = n, v.HKCR = e, v.HKU = s, v.HKCC = o, v.HIVES = d, v.REG_SZ = _, v.REG_MULTI_SZ = y, v.REG_EXPAND_SZ = w, v.REG_DWORD = R, v.REG_QWORD = b, v.REG_BINARY = U, v.REG_NONE = ae, v.REG_TYPES = oe, v.DEFAULT_VALUE = Ge, v.prototype.values = function(u) {
    if (typeof u != "function")
      throw new TypeError("must specify a callback");
    var l = ["QUERY", this.path];
    k(l, this.arch);
    var c = a(O(), l, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), p = "", h = this, f = null, A = T(c);
    return c.on("close", function(g) {
      if (!f)
        if (g !== 0)
          u(G("QUERY", g, A), null);
        else {
          for (var m = [], L = [], P = p.split(`
`), D = 0, x = 0, N = P.length; x < N; x++) {
            var S = P[x].trim();
            S.length > 0 && (D != 0 && m.push(S), ++D);
          }
          for (var x = 0, N = m.length; x < N; x++) {
            var H = ue.exec(m[x]), Y, C, I;
            H && (Y = H[1].trim(), C = H[2].trim(), I = H[3], L.push(new M(h.host, h.hive, h.key, Y, C, I, h.arch)));
          }
          u(null, L);
        }
    }), c.stdout.on("data", function(g) {
      p += g.toString();
    }), c.on("error", function(g) {
      f = g, u(g);
    }), this;
  }, v.prototype.keys = function(u) {
    if (typeof u != "function")
      throw new TypeError("must specify a callback");
    var l = ["QUERY", this.path];
    k(l, this.arch);
    var c = a(O(), l, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), p = "", h = this, f = null, A = T(c);
    return c.on("close", function(g) {
      f || g !== 0 && u(G("QUERY", g, A), null);
    }), c.stdout.on("data", function(g) {
      p += g.toString();
    }), c.stdout.on("end", function() {
      for (var g = [], m = [], L = p.split(`
`), P = 0, D = L.length; P < D; P++) {
        var x = L[P].trim();
        x.length > 0 && g.push(x);
      }
      for (var P = 0, D = g.length; P < D; P++) {
        var N = Oe.exec(g[P]), S;
        N && (N[1], S = N[2], S && S !== h.key && m.push(new v({
          host: h.host,
          hive: h.hive,
          key: S,
          arch: h.arch
        })));
      }
      u(null, m);
    }), c.on("error", function(g) {
      f = g, u(g);
    }), this;
  }, v.prototype.get = function(u, l) {
    if (typeof l != "function")
      throw new TypeError("must specify a callback");
    var c = ["QUERY", this.path];
    u == "" ? c.push("/ve") : c = c.concat(["/v", u]), k(c, this.arch);
    var p = a(O(), c, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), h = "", f = this, A = null, g = T(p);
    return p.on("close", function(m) {
      if (!A)
        if (m !== 0)
          l(G("QUERY", m, g), null);
        else {
          for (var L = [], P = null, D = h.split(`
`), x = 0, N = 0, S = D.length; N < S; N++) {
            var H = D[N].trim();
            H.length > 0 && (x != 0 && L.push(H), ++x);
          }
          var Y = L[L.length - 1] || "", C = ue.exec(Y), I, ce, le;
          C && (I = C[1].trim(), ce = C[2].trim(), le = C[3], P = new M(f.host, f.hive, f.key, I, ce, le, f.arch)), l(null, P);
        }
    }), p.stdout.on("data", function(m) {
      h += m.toString();
    }), p.on("error", function(m) {
      A = m, l(m);
    }), this;
  }, v.prototype.set = function(u, l, c, p) {
    if (typeof p != "function")
      throw new TypeError("must specify a callback");
    if (oe.indexOf(l) == -1)
      throw Error("illegal type specified.");
    var h = ["ADD", this.path];
    u == "" ? h.push("/ve") : h = h.concat(["/v", u]), h = h.concat(["/t", l, "/d", c, "/f"]), k(h, this.arch);
    var f = a(O(), h, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), A = null, g = T(f);
    return f.on("close", function(m) {
      A || p(m !== 0 ? G("ADD", m, g) : null);
    }), f.stdout.on("data", function(m) {
    }), f.on("error", function(m) {
      A = m, p(m);
    }), this;
  }, v.prototype.remove = function(u, l) {
    if (typeof l != "function")
      throw new TypeError("must specify a callback");
    var c = u ? ["DELETE", this.path, "/f", "/v", u] : ["DELETE", this.path, "/f", "/ve"];
    k(c, this.arch);
    var p = a(O(), c, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), h = null, f = T(p);
    return p.on("close", function(A) {
      h || (A !== 0 ? l(G("DELETE", A, f), null) : l(null));
    }), p.stdout.on("data", function(A) {
    }), p.on("error", function(A) {
      h = A, l(A);
    }), this;
  }, v.prototype.clear = function(u) {
    if (typeof u != "function")
      throw new TypeError("must specify a callback");
    var l = ["DELETE", this.path, "/f", "/va"];
    k(l, this.arch);
    var c = a(O(), l, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), p = null, h = T(c);
    return c.on("close", function(f) {
      p || (f !== 0 ? u(G("DELETE", f, h), null) : u(null));
    }), c.stdout.on("data", function(f) {
    }), c.on("error", function(f) {
      p = f, u(f);
    }), this;
  }, v.prototype.erase = v.prototype.clear, v.prototype.destroy = function(u) {
    if (typeof u != "function")
      throw new TypeError("must specify a callback");
    var l = ["DELETE", this.path, "/f"];
    k(l, this.arch);
    var c = a(O(), l, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), p = null, h = T(c);
    return c.on("close", function(f) {
      p || (f !== 0 ? u(G("DELETE", f, h), null) : u(null));
    }), c.stdout.on("data", function(f) {
    }), c.on("error", function(f) {
      p = f, u(f);
    }), this;
  }, v.prototype.create = function(u) {
    if (typeof u != "function")
      throw new TypeError("must specify a callback");
    var l = ["ADD", this.path, "/f"];
    k(l, this.arch);
    var c = a(O(), l, {
      cwd: void 0,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"]
    }), p = null, h = T(c);
    return c.on("close", function(f) {
      p || (f !== 0 ? u(G("ADD", f, h), null) : u(null));
    }), c.stdout.on("data", function(f) {
    }), c.on("error", function(f) {
      p = f, u(f);
    }), this;
  }, v.prototype.keyExists = function(u) {
    return this.values(function(l, c) {
      if (l)
        return l.code == 1 ? u(null, !1) : u(l);
      u(null, !0);
    }), this;
  }, v.prototype.valueExists = function(u, l) {
    return this.get(u, function(c, p) {
      if (c)
        return c.code == 1 ? l(null, !1) : l(c);
      l(null, !0);
    }), this;
  }, Q = v, Q;
}
var X, de;
function We() {
  if (de) return X;
  de = 1;
  var t, r, a, i;
  return r = j, a = K, t = Ye(), i = new t({
    hive: t.HKCU,
    key: "\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
  }), X = {
    /* Public */
    enable: function(n) {
      var e, s, o;
      return e = n.appName, s = n.appPath, o = n.isHiddenOnLaunch, new Promise(function(d, _) {
        var y, w, R, b;
        return w = s, y = "", b = a.join(a.dirname(process.execPath), "..", "update.exe"), ((R = process.versions) != null ? R.electron : void 0) != null && r.existsSync(b) ? (w = b, y = ' --processStart "' + a.basename(process.execPath) + '"', o && (y += ' --process-start-args "--hidden"')) : o && (y += " --hidden"), i.set(e, t.REG_SZ, '"' + w + '"' + y, function(U) {
          return U != null ? _(U) : d();
        });
      });
    },
    disable: function(n) {
      return new Promise(function(e, s) {
        return i.remove(n, function(o) {
          return o != null ? o.message.indexOf("The system was unable to find the specified registry key or value") !== -1 ? e(!1) : s(o) : e();
        });
      });
    },
    isEnabled: function(n) {
      return new Promise(function(e, s) {
        return i.get(n, function(o, d) {
          return o != null ? e(!1) : e(d != null);
        });
      });
    }
  }, X;
}
var z = {}, J = {}, ve;
function Be() {
  return ve || (ve = 1, function(t) {
    t.parse = function(i) {
      if (i.length != 0) {
        var n = r.call({
          value: i,
          index: 0
        });
        return n;
      }
    };
    function r() {
      var i = this.value[this.index];
      switch (i) {
        case "{":
          return t.ArrayParser.call(this);
        case '"':
          return t.StringParser.call(this);
        case "a":
          if (this.value.substring(this.index, this.index + 5) == "alias")
            return t.AliasParser.call(this);
          break;
        case "«":
          if (this.value.substring(this.index, this.index + 5) == "«data")
            return t.DataParser.call(this);
          break;
      }
      return isNaN(i) ? t.UndefinedParser.call(this) : t.NumberParser.call(this);
    }
    t.AliasParser = function() {
      return this.index += 6, "/Volumes/" + t.StringParser.call(this).replace(/:/g, "/");
    }, t.ArrayParser = function() {
      for (var i = [], n = this.value[++this.index]; n != "}"; )
        i.push(r.call(this)), this.value[this.index] == "," && (this.index += 2), n = this.value[this.index];
      return this.index++, i;
    }, t.DataParser = function() {
      var i = t.UndefinedParser.call(this);
      i = i.substring(6, i.length - 1);
      var n = i.substring(0, 4);
      i = i.substring(4, i.length);
      for (var e = new Buffer(i.length / 2), s = 0, o = 0, d = i.length; o < d; o += 2)
        e[s++] = parseInt(i[o] + i[o + 1], 16);
      return e.type = n, e;
    }, t.NumberParser = function() {
      return Number(t.UndefinedParser.call(this));
    }, t.StringParser = function(i) {
      for (var n = "", e = ++this.index, s = this.value[e++]; s != '"'; )
        s == "\\" && (n += this.value.substring(this.index, e - 1), this.index = e++), s = this.value[e++];
      return n += this.value.substring(this.index, e - 1), this.index = e, n;
    };
    var a = /}|,|\n/;
    t.UndefinedParser = function() {
      for (var i = this.index, n = this.value[i++]; !a.test(n); )
        n = this.value[i++];
      var e = this.value.substring(this.index, i - 1);
      return this.index = i - 1, e;
    };
  }(J)), J;
}
var Ee;
function je() {
  return Ee || (Ee = 1, function(t) {
    var r = be.spawn;
    t.Parsers = Be();
    var a = t.Parsers.parse;
    t.osascript = "osascript", t.execFile = function(s, o, d) {
      return Array.isArray(o) || (d = o, o = []), i(s, o, d);
    }, t.execString = function(s, o) {
      return i(s, o);
    };
    function i(e, s, o) {
      var d = !1;
      Array.isArray(s) || (o = s, s = [], d = !0), s.push("-ss"), d || s.push(e);
      var _ = r(t.osascript, s);
      n(_.stdout), n(_.stderr), _.on("exit", function(y) {
        var w = a(_.stdout.body), R;
        y && (R = new Error(_.stderr.body), R.appleScript = e, R.exitCode = y), o && o(R, w, _.stderr.body);
      }), d && (_.stdin.write(e), _.stdin.end());
    }
    function n(e) {
      e.body = "", e.setEncoding("utf8"), e.on("data", function(s) {
        e.body += s;
      });
    }
  }(z)), z;
}
var ee, _e;
function Ne() {
  if (_e) return ee;
  _e = 1;
  const t = Ce.homedir();
  return ee = (r) => {
    if (typeof r != "string")
      throw new TypeError(`Expected a string, got ${typeof r}`);
    return t ? r.replace(/^~(?=$|\/|\\)/, t) : r;
  }, ee;
}
var te, ge;
function Ze() {
  if (ge) return te;
  ge = 1;
  var t = K, r = j, a = parseInt("0777", 8);
  te = i.mkdirp = i.mkdirP = i;
  function i(n, e, s, o) {
    typeof e == "function" ? (s = e, e = {}) : (!e || typeof e != "object") && (e = { mode: e });
    var d = e.mode, _ = e.fs || r;
    d === void 0 && (d = a), o || (o = null);
    var y = s || /* istanbul ignore next */
    function() {
    };
    n = t.resolve(n), _.mkdir(n, d, function(w) {
      if (!w)
        return o = o || n, y(null, o);
      switch (w.code) {
        case "ENOENT":
          if (t.dirname(n) === n) return y(w);
          i(t.dirname(n), e, function(R, b) {
            R ? y(R, b) : i(n, e, y, b);
          });
          break;
        default:
          _.stat(n, function(R, b) {
            R || !b.isDirectory() ? y(w, o) : y(null, o);
          });
          break;
      }
    });
  }
  return i.sync = function n(e, s, o) {
    (!s || typeof s != "object") && (s = { mode: s });
    var d = s.mode, _ = s.fs || r;
    d === void 0 && (d = a), o || (o = null), e = t.resolve(e);
    try {
      _.mkdirSync(e, d), o = o || e;
    } catch (w) {
      switch (w.code) {
        case "ENOENT":
          o = n(t.dirname(e), s, o), n(e, s, o);
          break;
        default:
          var y;
          try {
            y = _.statSync(e);
          } catch {
            throw w;
          }
          if (!y.isDirectory()) throw w;
          break;
      }
    }
    return o;
  }, te;
}
var ne, ye;
function Se() {
  if (ye) return ne;
  ye = 1;
  var t, r;
  return t = j, r = Ze(), ne = {
    /* Public */
    createFile: function(a) {
      var i, n, e;
      return n = a.directory, e = a.filePath, i = a.data, new Promise(function(s, o) {
        return r(n, function(d) {
          return d != null ? o(d) : t.writeFile(e, i, function(_) {
            return _ != null ? o(_) : s();
          });
        });
      });
    },
    isEnabled: function(a) {
      return new Promise(/* @__PURE__ */ function(i) {
        return function(n, e) {
          return t.stat(a, function(s, o) {
            return s != null ? n(!1) : n(o != null);
          });
        };
      }());
    },
    removeFile: function(a) {
      return new Promise(/* @__PURE__ */ function(i) {
        return function(n, e) {
          return t.stat(a, function(s) {
            return s != null ? n() : t.unlink(a, function(o) {
              return o != null ? e(o) : n();
            });
          });
        };
      }());
    }
  }, ne;
}
var re, me;
function Ve() {
  if (me) return re;
  me = 1;
  var t, r, a, i = [].indexOf || function(n) {
    for (var e = 0, s = this.length; e < s; e++)
      if (e in this && this[e] === n) return e;
    return -1;
  };
  return t = je(), a = Ne(), r = Se(), re = {
    /* Public */
    enable: function(n) {
      var e, s, o, d, _, y, w, R, b;
      return e = n.appName, s = n.appPath, d = n.isHiddenOnLaunch, y = n.mac, y.useLaunchAgent ? (w = [s], d && w.push("--hidden"), R = w.map(function(U) {
        return "    <string>" + U + "</string>";
      }).join(`
`), o = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>` + e + `</string>
  <key>ProgramArguments</key>
  <array>
  ` + R + `
  </array>
  <key>RunAtLoad</key>
  <true/>
</dict>
</plist>`, r.createFile({
        data: o,
        directory: this.getDirectory(),
        filePath: this.getFilePath(e)
      })) : (_ = d ? "true" : "false", b = '{path:"' + s + '", hidden:' + _ + ', name:"' + e + '"}', this.execApplescriptCommand("make login item at end with properties " + b));
    },
    disable: function(n, e) {
      return e.useLaunchAgent ? r.removeFile(this.getFilePath(n)) : this.execApplescriptCommand('delete login item "' + n + '"');
    },
    isEnabled: function(n, e) {
      return e.useLaunchAgent ? r.isEnabled(this.getFilePath(n)) : this.execApplescriptCommand("get the name of every login item").then(function(s) {
        return s != null && i.call(s, n) >= 0;
      });
    },
    /* Private */
    execApplescriptCommand: function(n) {
      return new Promise(function(e, s) {
        return t.execString('tell application "System Events" to ' + n, function(o, d) {
          return o != null ? s(o) : e(d);
        });
      });
    },
    getDirectory: function() {
      return a("~/Library/LaunchAgents/");
    },
    getFilePath: function(n) {
      return "" + this.getDirectory() + n + ".plist";
    }
  }, re;
}
var ie, we;
function Qe() {
  if (we) return ie;
  we = 1;
  var t, r;
  return r = Ne(), t = Se(), ie = {
    /* Public */
    enable: function(a) {
      var i, n, e, s, o;
      return i = a.appName, n = a.appPath, o = a.isHiddenOnLaunch, s = o ? " --hidden" : "", e = `[Desktop Entry]
Type=Application
Version=1.0
Name=` + i + `
Comment=` + i + `startup script
Exec=` + n + s + `
StartupNotify=false
Terminal=false`, t.createFile({
        data: e,
        directory: this.getDirectory(),
        filePath: this.getFilePath(i)
      });
    },
    disable: function(a) {
      return t.removeFile(this.getFilePath(a));
    },
    isEnabled: function(a) {
      return t.isEnabled(this.getFilePath(a));
    },
    /* Private */
    getDirectory: function() {
      return r("~/.config/autostart/");
    },
    getFilePath: function(a) {
      return "" + this.getDirectory() + a + ".desktop";
    }
  }, ie;
}
var Te, W = function(t, r) {
  return function() {
    return t.apply(r, arguments);
  };
};
Te = Ke;
var Xe = function() {
  function t(r) {
    var a, i, n, e, s;
    if (n = r.name, a = r.isHidden, i = r.mac, e = r.path, this.fixOpts = W(this.fixOpts, this), this.isEnabled = W(this.isEnabled, this), this.disable = W(this.disable, this), this.enable = W(this.enable, this), n == null)
      throw new Error("You must specify a name");
    if (this.opts = {
      appName: n,
      isHiddenOnLaunch: a ?? !1,
      mac: i ?? {}
    }, s = typeof process < "u" && process !== null ? process.versions : void 0, e != null) {
      if (!Te(e))
        throw new Error("path must be absolute");
      this.opts.appPath = e;
    } else if (s != null && (s.nw != null || s["node-webkit"] != null || s.electron != null))
      this.opts.appPath = process.execPath;
    else
      throw new Error("You must give a path (this is only auto-detected for NW.js and Electron apps)");
    if (this.fixOpts(), this.api = null, /^win/.test(process.platform))
      this.api = We();
    else if (/darwin/.test(process.platform))
      this.api = Ve();
    else if (/linux/.test(process.platform) || /freebsd/.test(process.platform))
      this.api = Qe();
    else
      throw new Error("Unsupported platform");
  }
  return t.prototype.enable = function() {
    return this.api.enable(this.opts);
  }, t.prototype.disable = function() {
    return this.api.disable(this.opts.appName, this.opts.mac);
  }, t.prototype.isEnabled = function() {
    return this.api.isEnabled(this.opts.appName, this.opts.mac);
  }, t.prototype.fixMacExecPath = function(r, a) {
    return r = r.replace(/(^.+?[^\/]+?\.app)\/Contents\/(Frameworks\/((\1|[^\/]+?) Helper)\.app\/Contents\/MacOS\/\3|MacOS\/Electron)/, "$1"), a.useLaunchAgent || (r = r.replace(/\.app\/Contents\/MacOS\/[^\/]*$/, ".app")), r;
  }, t.prototype.fixOpts = function() {
    var r;
    if (this.opts.appPath = this.opts.appPath.replace(/\/$/, ""), /darwin/.test(process.platform) && (this.opts.appPath = this.fixMacExecPath(this.opts.appPath, this.opts.mac)), this.opts.appPath.indexOf("/") !== -1 ? (r = this.opts.appPath.split("/"), this.opts.appName = r[r.length - 1]) : this.opts.appPath.indexOf("\\") !== -1 && (r = this.opts.appPath.split("\\"), this.opts.appName = r[r.length - 1], this.opts.appName = this.opts.appName.substr(0, this.opts.appName.length - 4)), /darwin/.test(process.platform) && this.opts.appName.indexOf(".app", this.opts.appName.length - 4) !== -1)
      return this.opts.appName = this.opts.appName.substr(0, this.opts.appName.length - 4);
  }, t;
}();
const { app: Re, ipcMain: Ae } = B, ze = Xe;
class Je {
  constructor(r = {}) {
    this.appName = r.appName || Re.getName(), this.isHidden = r.isHidden || !1, this.autoLauncher = new ze({
      name: this.appName,
      path: Re.getPath("exe"),
      isHidden: this.isHidden
    }), this.isEnabled = !1;
  }
  // 初始化并检查当前状态
  async init() {
    try {
      return this.isEnabled = await this.autoLauncher.isEnabled(), this.isEnabled;
    } catch (r) {
      return console.error("检查自启动状态失败:", r), !1;
    }
  }
  // 启用自启动
  async enable() {
    try {
      return this.isEnabled || (await this.autoLauncher.enable(), this.isEnabled = !0), !0;
    } catch (r) {
      if (console.error("启用自启动失败:", r), r.message.includes("Access denied") || r.code === "ACCESS_DENIED") {
        const { dialog: a } = B;
        await a.showMessageBox({
          type: "info",
          title: "开机自启动设置",
          message: "无法设置开机自启动",
          detail: `您可以通过以下步骤手动设置：
1. 打开任务管理器
2. 切换到"启动"选项卡
3. 找到应用并启用`,
          buttons: ["我知道了"]
        });
      }
      return console.error("Failed to enable auto-launch:", r), !1;
    }
  }
  // 禁用自启动
  async disable() {
    try {
      return this.isEnabled && (await this.autoLauncher.disable(), this.isEnabled = !1), !0;
    } catch (r) {
      return console.error("禁用自启动失败:", r), !1;
    }
  }
  // 切换自启动状态
  async toggle(r) {
    try {
      return r ? await this.enable() : await this.disable(), { success: !0, message: "切换自启动状态成功" };
    } catch (a) {
      return { success: !1, message: a };
    }
  }
  // 获取当前状态
  getState() {
    return this.isEnabled;
  }
}
async function et() {
  const t = new Je({
    appName: "todoList",
    // 可选，默认使用 app.getName()
    isHidden: !1
    // 可选，是否隐藏窗口启动
  });
  await t.init(), Ae.handle("toggle-auto-launch", async (r, a) => await t.toggle(a)), Ae.handle("get-auto-launch-state", () => t.getState());
}
var tt = et;
const { app: $, BrowserWindow: se, globalShortcut: nt } = B, rt = qe, it = tt, Pe = K;
$.on("window-all-closed", () => {
  process.platform !== "darwin" && $.quit();
});
let q;
function xe() {
  q = new se({
    width: 1e3,
    height: 800,
    show: !1,
    webPreferences: {
      nodeIntegration: !0,
      contextIsolation: !0,
      preload: Pe.join(__dirname, "api/preload.cjs")
    },
    webContents: {
      openDevTools: !0
    }
  }), process.env.VITE_DEV_SERVER_URL ? q.loadURL(process.env.VITE_DEV_SERVER_URL) : q.loadFile(Pe.join(__dirname, "../dist/index.html")), q.once("ready-to-show", () => {
    q.show();
  });
}
$.whenReady().then(async () => {
  xe(), rt(), it(), $.on("activate", function() {
    se.getAllWindows().length === 0 && xe();
  }), nt.register("CommandOrControl+Shift+I", () => {
    se.getFocusedWindow().webContents.toggleDevTools();
  });
});
$.on("window-all-closed", function() {
  process.platform !== "darwin" && $.quit();
});
export {
  ft as default
};
