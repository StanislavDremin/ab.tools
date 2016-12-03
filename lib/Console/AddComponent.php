<?php
/**
 * Created by OOO 1C-SOFT.
 * User: GrandMaster
 * Date: 25.11.2016
 */

namespace AB\Tools\Console;

use Bitrix\Main\IO\File;
use Bitrix\Main;

class AddComponent implements IConsole
{
	/**
	 * @var array - массив параметров CLI
	 */
	protected $params;
	private $root;
	/**
	 * Creator constructor. В конструктор приходят все параметры из CLI
	 *
	 * @param array $params
	 */
	public function __construct($params = [])
	{
		global $argv;

		if (count($params) == 0 || is_null($params)){
			$this->params = $argv;
		}

		$this->params = $params;
		$this->root = Main\Application::getDocumentRoot();
	}

	/**
	 * @method description - недольшое описание комнады: для чего, для кого и пр.
	 * @return string
	 */
	public function description()
	{
		return 'add description';
	}

	/**
	 * @method getParams - get param params
	 * @return array
	 */
	public function getParams()
	{
		return $this->params;
	}

	/**
	 * @method setParams - set param Params
	 * @param array $params
	 */
	public function setParams($params)
	{
		$this->params = $params;
	}

	/**
	 * @method run - Это основной метод для запуска скрипта
	 * @throws \Exception
	 */
	public function run()
	{
		$params = $this->params['params'];

		if(strlen($params['-name']) == 0){
			throw new Main\ArgumentException('Parameter -name is empty');
		}
		if(strlen($params['-c']) == 0){
			throw new Main\ArgumentException('Parameter -c - class name for component is empty');
		}

		$arName = explode(':',$params['-name']);
		if(count($arName) < 2){
			throw new Main\ArgumentException('Component name must be ab:new.test.cmp');
		}

		$folder = $params['-f'] ? trim($params['-f']) : 'local';

		$path = '/'.$folder.'/components/'.$arName[0].'/'.$arName[1];
		$ClassFile = new File($this->root.$path.'/class.php');
		if($ClassFile->getDirectory()->isExists()){
			throw new \Exception('Component '.$params['-name'].' is already exist');
		}
		$ClassFile->getDirectory()->create();
		$templeClass = file_get_contents(dirname(__FILE__).'/temple/cmp/class');
		$templeClass = str_replace("#CLASS#", $params['-c'], $templeClass);
		$res = $ClassFile->putContents($templeClass);
		if($res == 0){
			throw new \Exception('Failed to write file component');
		}
		$Lang = new File($ClassFile->getDirectory()->getPhysicalPath().'/lang/ru/class.php');
		$Lang->putContents('');

		$templateName = strlen($params['-t']) > 0 ? trim($params['-t']) : '.default';

		$FileTemple = new File($ClassFile->getDirectory()->getPhysicalPath().'/templates/'.$templateName.'/template.php');
		$FileTemple->getDirectory()->create();
		$templeTemple = file_get_contents(dirname(__FILE__).'/temple/cmp/template');
		$FileTemple->putContents($templeTemple);

		$Lang = new File($FileTemple->getDirectory()->getPhysicalPath().'/lang/ru/template.php');
		$Lang->putContents('');

		ProgressBar::showGood('Component is created', true);
	}

}