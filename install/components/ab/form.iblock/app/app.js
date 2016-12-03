import MainForm from './form/MainForm';

BX(function () {
	let app = $('#ab_form_add'), params = app.data('enc');
	ReactDOM.render(
		<MainForm
			formId="ab_feedback1"
			arParams={params}
		/>,
		app[0]
	);
});
