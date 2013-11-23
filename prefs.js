const Gio  = imports.gi.Gio;
const Gtk  = imports.gi.Gtk;
const Lang = imports.lang;
const Me   = imports.misc.extensionUtils.getCurrentExtension();

let settings = {};

function init() {
    const GioSSS = Gio.SettingsSchemaSource;

    let schema = Me.metadata['settings-schema'];
    let source = GioSSS.new_from_directory(Me.dir.get_child('schemas').get_path(),
                                           GioSSS.get_default(),
                                           false);

    settings = new Gio.Settings({
        settings_schema : source.lookup(schema, true)
    });

    let set_boolean = Lang.bind(settings, settings.set_boolean);
    let set_string = Lang.bind(settings, settings.set_string);
    settings.set_boolean = function(key, value) {
        set_boolean(key, value);
        Gio.Settings.sync();
    };
    settings.set_string = function(key, value) {
        set_string(key, value);
        Gio.Settings.sync();
    };
}

function getCommandEnabled() {
    return settings.get_boolean('enabled');
}

function toggleCommandEnabled() {
    settings.set_boolean('enabled', !getCommandEnabled());
}

function getCommand() {
    return settings.get_string('command');
}

function setCommand(command) {
    settings.set_string('command', command);
}

function buildPrefsWidget() {
    let box = new Gtk.HBox({
        halign : Gtk.Align.FILL,
        margin : 5
    });

    let entry = new Gtk.Entry({
        text : getCommand()
    });

    let button = new Gtk.Button({
        label : 'Apply'
    });

    let svvitch = new Gtk.Switch({
        active : getCommandEnabled()
    });

    box.pack_start(svvitch, false, false, 5);
    box.pack_start(entry, true, true, 5);
    box.pack_start(button, false, false, 0);

    button.connect('clicked', function() {
        setCommand(entry.get_text());
    });
    svvitch.connect('notify::active', toggleCommandEnabled);

    box.show_all();
    return box;
}
