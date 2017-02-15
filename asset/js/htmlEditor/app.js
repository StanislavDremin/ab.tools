/**
 * Created by dremin_s on 14.02.2017.
 */
/** @var o React */
/** @var o ReactDOM */
/** @var o is */
/** @var o $ */
"use strict";
import className from 'classnames';

class AppCode extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedLang: 'all',
			showLineNum: true,
			codeText: ''
		};

		this.lang = [
			{title: 'Мне повезет', value: 'all'},
			{title: 'PHP', value: 'php'},
			{title: 'JavaScript', value: 'javascript'},
			{title: 'React JSX', value: 'jsx'},
			{title: 'json', value: 'json'},
		];

		this.BXEditor = props.editor;

		this.setLineNum = this.setLineNum.bind(this);
		this.setLang = this.setLang.bind(this);
		this.setCodeText = this.setCodeText.bind(this);
		this.insertCodeToEditor = this.insertCodeToEditor.bind(this);
	}

	setLang(ev) {
		let newVal = this.lang.filter((el) => {
			return ev.target.value === el.value;
		});
		if(newVal.length == 1){
			this.setState({selectedLang: newVal});
		}
	}

	setLineNum(ev){
		this.setState({showLineNum: !this.state.showLineNum});
	}

	setCodeText(ev){
		this.setState({codeText: ev.target.value});
	}

	insertCodeToEditor(dialog){
		let lang = '';
		if(typeof this.state.selectedLang == 'object'){
			lang = 'language-' + this.state.selectedLang[0].value;
		}
		let classPre = className(lang, {'line-numbers': this.state.showLineNum});

		let htmlCode = '<pre class="'+ classPre +'"><code class="'+ lang +'">';
		htmlCode += this.state.codeText;
		htmlCode += '</code></pre>';

		this.BXEditor.InsertHtml(htmlCode, this.BXEditor.selection.GetRange());
		dialog.Close();
		setTimeout(() => {
			this.BXEditor.SetContent(this.BXEditor.GetContent());
			this.BXEditor.ReInitIframe();
		}, 50);
	}

	componentDidMount() {
		let {dialog} = this.props;

		dialog.SetButtons([
			{
				title: 'Сохранить',
				name: 'save',
				id: 'codeSave',
				className: "adm-btn-save",
				action: this.insertCodeToEditor.bind(this, dialog)
			},
			BX.CDialog.btnCancel
		]);
	}


	render() {

		return (
			<div className="block_code_wrap">
				<div className="macro-insert-container">
					<div className="macro-input-fields dialog-panel">
						<div className="macro-param-div" id="macro-param-div-language">
							<label htmlFor="macro-param-language">Выберите язык</label>
							<select name="ab_select_lang" className="select" id="ab_select_lang" onChange={this.setLang}>
								{this.lang.map((el) => {
									return <option key={el.value} value={el.value}>{el.title}</option>
								})}
							</select>
						</div>
						<div className="checkbox macro-param-div boolean-param">
							<input className="checkbox macro-param-input" id="macro-param-linenumbers"
								name="show_line_num" onChange={this.setLineNum}
								type="checkbox" value={!this.state.showLineNum} checked={className({'checked': this.state.showLineNum})} />
							<label className="checkbox" htmlFor="macro-param-linenumbers">Показывать номера страниц</label>
						</div>
					</div>
					<div className="macro-preview-container dialog-panel">
						<div className="macro-preview-header">
							<h4>Код</h4>
						</div>
						<div id="macro-browser-preview" className="macro-preview">
							<textarea className="code_block_text" name="code_block_text" onChange={this.setCodeText}>{this.state.codeText}</textarea>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


	$.get('/local/modules/ab.tools/asset/js/htmlEditor/lib/prism.css', function(data){
		BX.addCustomEvent('OnEditorInitedBefore', function (editor) {

			const codeDialog = new BX.CDialog({
			title: 'Вставка кода',
			content: '<div id="ab_code_editor"></div>',
			min_width: 960,
			min_height: 600,
		});

		editor.iframeCssText = data;
		this.AddButton({
			iconClassName: 'ab_html_edit_code',
			id: 'ab_html_edit_code_btn',
			name: 'test',
			handler: function (ev) {
				codeDialog.SetSize({width: 960, height: 600});
				codeDialog.Show();

				// codeDialog.addButtons([
				// 	{
				// 		title: 'Сохранить',
				// 		name: 'save',
				// 		id: 'codeSave',
				// 		action:
				// 	}
				// ]);
				// ReactDOM.render(<AppCode editor={editor} />, codeDialog.PARAMS.content);
				// let html = editor.selection.GetRange().toHtml();
				// let allContent = editor.GetContent();
				// let lineText = editor.selection.GetRange().startContainer.wholeText;
				// console.info(lineText);
				// console.info(html);
				// if(html.length == 0 && lineText.length > 0){
				// 	allContent.replace(lineText, '');
				// 	console.info(allContent);
				// }
				// editor.InitUtil.util.ReplaceNode(editor.selection.GetSelectedNode(), '<h3>' + html + '</h3>');
				// editor.InsertHtml('<h3>' + html + '</h3>', editor.selection.GetRange());
			}
		});
			BX.addCustomEvent('onWindowRegister', () => {
				ReactDOM.render(<AppCode editor={editor} dialog={codeDialog} />, codeDialog.PARAMS.content);
			});

			BX.addCustomEvent('onWindowUnRegister', () => {
				ReactDOM.unmountComponentAtNode(codeDialog.PARAMS.content);
				codeDialog.ClearButtons();
			});
		});
	});






