<?
IncludeModuleLangFile(__FILE__);
use Bitrix\Main\ModuleManager;
use Bitrix\Main\UrlRewriter;
use Bitrix\Main\IO;


if (class_exists("ab_tools"))
	return;

class ab_tools extends CModule
{
	public $MODULE_ID = "ab.tools";
	public $MODULE_VERSION;
	public $MODULE_VERSION_DATE;
	public $MODULE_NAME;
	public $MODULE_DESCRIPTION;
	public $MODULE_CSS;
	public $PARTNER_NAME;
	public $PARTNER_URI;

	protected $eventManager;

	protected $events = [];

	function __construct()
	{
		$arModuleVersion = array();

		include(dirname(__FILE__) . "/version.php");

		$this->MODULE_VERSION = $arModuleVersion["VERSION"];
		$this->MODULE_VERSION_DATE = $arModuleVersion["VERSION_DATE"];

		$this->MODULE_NAME = GetMessage("AB_TOOLS_INSTALL_NAME");
		$this->PARTNER_NAME = GetMessage("AB_PARTNER_NAME");
//		$this->PARTNER_URI = GetMessage("ST_PARTNER_URI");

		$this->eventManager = \Bitrix\Main\EventManager::getInstance();

		$this->events = [
			['main', 'OnPageStart', $this->MODULE_ID, '\AB\Tools\EventHandlers', 'onPageStart'],
			['main', 'OnProlog', $this->MODULE_ID, '\AB\Tools\EventHandlers', 'OnProlog'],
			['fileman', 'OnBeforeHTMLEditorScriptRuns', $this->MODULE_ID, '\AB\Tools\EventHandlers', 'onIncludeHTMLEditorScript'],
		];
	}

	public function DoInstall()
	{
		$this->addRest();
		ModuleManager::registerModule($this->MODULE_ID);

		$this->addEvents();

		$root = \Bitrix\Main\Application::getDocumentRoot();

		CopyDirFiles(__DIR__ . '/components/ab', $root . "/local/components/ab", true, true);
		CopyDirFiles(__DIR__ . '/public/webpack', $root . "/local/webpack", true, true);
		CopyDirFiles(__DIR__ . '/public/console', $root . "/", true, true);

		$File = new IO\File($root.'/console');
		$File->putContents(file_get_contents(__DIR__.'/public/console'));

		return true;
	}

	public function DoUninstall()
	{
		$this->delEvents();
		ModuleManager::unRegisterModule($this->MODULE_ID);
		$this->deleteRest();

		return true;
	}

	/**
	 * @method addRest
	 */
	protected function addRest()
	{
		$arUrl = UrlRewriter::getList(SITE_ID, ['ID' => 'restModule']);

		if(empty($arUrl)){
			UrlRewriter::add(SITE_ID, [
				'CONDITION' => '#^/rest/(.*)#',
				'PATH' => '/rest/index.php',
				'RULE' => 'data=$1',
				'ID' => 'restModule',
				'SORT' => 100500
			]);
		}
		$arUrlForm = UrlRewriter::getList(SITE_ID, ['ID' => 'ab:form.iblock','CONDITION' => '/forms/iblock']);
		if(empty($arUrlForm)){
			UrlRewriter::add(SITE_ID, [
				'CONDITION' => '/forms/iblock',
				'PATH' => '\\AB\\Tools\\Forms\\FormIblock',
				'RULE' => '',
				'ID' => 'ab:form.iblock',
				'SORT' => 100510
			]);
		}

		$root = \Bitrix\Main\Application::getDocumentRoot();
		$File = new IO\File($root . '/rest/index.php');
		$File->getDirectory()->create();
		$temple = file_get_contents(__DIR__ . '/rest/.temple');
		$File->putContents($temple);

//		CopyDirFiles(__DIR__ . '/rest/.routes', $root . "/local/php_interface/ab.tools/routes.php", true, true);
	}

	public function addEvents()
	{
		foreach ($this->events as $event) {
			$this->eventManager->registerEventHandler($event[0], $event[1], $event[2], $event[3], $event[4]);
		}
	}

	public function delEvents()
	{
		foreach ($this->events as $event) {
			$this->eventManager->unRegisterEventHandler($event[0], $event[1], $event[2], $event[3], $event[4]);
		}
	}

	/**
	 * @method deleteRest
	 */
	protected function deleteRest()
	{
//		$arUrl = UrlRewriter::getList(SITE_ID, ['ID'=>'restModule']);
//		if(count($arUrl) > 0){
//			$root = \Bitrix\Main\Application::getDocumentRoot();
//			unlink($root.'/rest/index.php');
//			UrlRewriter::delete(SITE_ID, ['ID' => 'restModule']);
//		}
	}
}