window.onload = function() {
	var socket = io.connect("http://localhost");
	
	var editor = ace.edit("editor");
	editor.setTheme('ace/theme/vibrant_ink');
	var PhpMode = require("ace/mode/php").Mode;
	function changeEmitter(e) {
		socket.emit("change", e.data);
	}
	editor.getSession().setMode(new PhpMode());
	editor.on('change', changeEmitter);
	socket.on("change", function(data){
		console.log(data);
		editor.removeEventListener('change', changeEmitter);
		if(data.action == 'insertText'){
			editor.navigateTo(data.range.start.row,data.range.start.column);
			editor.insert(data.text);
		}
		if(data.action == 'insertLines'){
			editor.navigateTo(data.range.start.row,data.range.start.column);
			for(var i = 0; i < data.lines.length; i++)
				editor.insert(data.lines[i] + "\n");
		}
		if(data.action == 'removeText'){
			data.range.prototype = Range.prototype;
			var selection = editor.getSession().getSelection();
			selection.setSelectionRange(data.range);
			editor.remove();
		}
		if(data.action == 'removeLines'){
			data.range.prototype = Range.prototype;
			var selection = editor.getSession().getSelection();
			selection.setSelectionRange(data.range);
			editor.removeLines();
		}
		editor.on('change', changeEmitter);
	});
};