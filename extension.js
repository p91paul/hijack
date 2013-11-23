const Main           = imports.ui.main;
const Me             = imports.misc.extensionUtils.getCurrentExtension();
const MessageTray    = imports.ui.main.messageTray;
const Monitor        = imports.ui.main.layoutManager.bottomMonitor;
const PointerWatcher = imports.ui.pointerWatcher.getPointerWatcher();
const Util           = imports.misc.util;

const Prefs = Me.imports.prefs;

let orig   = {};
let custom = {};

function init() {
    Prefs.init();
    orig = PointerWatcher._watches[0];
}

function enable() {
    PointerWatcher._removeWatch(orig);

    custom = PointerWatcher.addWatch(100 /*ms*/, function(x, y) {
        if (x == Monitor.x && y == Monitor.y + Monitor.height - 1) {
            if (Prefs.getCommandEnabled() && Main.modalActorFocusStack.length == 0) {
                Util.spawnCommandLine(Prefs.getCommand());
            }
        }
        if (x == Monitor.x + Monitor.width - 1 && y == Monitor.y + Monitor.height - 1) {
            if (MessageTray._traySummoned) {
                MessageTray._escapeTray();
            } else {
                MessageTray.toggle();
            }
        }
    });
}

function disable() {
    PointerWatcher._removeWatch(custom);
    orig = PointerWatcher.addWatch(orig.interval, orig.callback);
}
