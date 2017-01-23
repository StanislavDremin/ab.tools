<?php
/**
 * Created by OOO 1C-SOFT.
 * User: GrandMaster
 * Date: 24.11.16
 */

namespace AB\Tools\Console\Scripts;

use Bitrix\Main\Application;
use Bitrix\Main\IO;
use AB\Tools\Console\ProgressBar;
use AB\Tools\Console\Process;

/**
 * Class Creator
 * @package AB\Tools\Console
 */
class Creator implements IConsole
{
	const MAIN_DIR = '/local/modules/ab.tools/lib/Console';

	/**
	 * @var array - массив параметров CLI
	 */
	protected $params;

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
	public function run($params)
	{
		$this->params['params'] = $params;

		$name = $this->params['params']['-name'];

		if(strlen($name) > 0){
			$File = new IO\File(Application::getDocumentRoot().self::MAIN_DIR.'/'.$name.'.php');
			if ($File->isExists()){
				throw new \Exception('File '.$name.'.php already exist');
			}

			$temple = file_get_contents(Application::getDocumentRoot().self::MAIN_DIR.'/temple/creator');

			$date = date('d.m.Y');
			$body = str_replace(["#DATE#", "#CLASS#"], [$date, $name], $temple);
			$File->putContents($body);

			ProgressBar::showGood('The script is created');
		} else {
			$allCommands = Process::getAllCommands();
			ProgressBar::pre($allCommands);
		}

	}

}