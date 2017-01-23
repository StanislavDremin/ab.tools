<?php
/**
 * Created by OOO 1C-SOFT.
 * User: teacher
 * Date: 24.11.16
 */

namespace AB\Tools\Console;

use Bitrix\Main\Web;
use Bitrix\Main;

class Process
{
	const CONFIG_FILE = '/command.json';

	/**
	 * @method getAllCommands
	 * @return mixed
	 */
	public static function getAllCommands()
	{
		return Web\Json::decode(file_get_contents(dirname(__FILE__).self::CONFIG_FILE));
	}

	/**
	 * @method getCommand
	 * @param $init
	 *
	 * @return array
	 */
	public static function getCommand($init)
	{
		$commands = self::getAllCommands();

		$main = array_shift($init);
		$type = explode(':', $main);

		if (count($type) == 1 && isset($commands[$type[0]])){
			$arParams = $commands[$type[0]];
		} else {
			$arParams = $commands[$type[0]][$type[1]];
		}

		$k = $v = $combine = [];

		if (!empty($arParams)){

			foreach ($init as $c => $item) {
				if (substr($item, 0, 1) == '-'){
					$arItem = explode('=', $item);
					if($arItem[1]){
						$combine[$arItem[0]] = $arItem[1];
						continue;
					} else {
						$combine[$arItem[0]] = false;
						if(isset($init[$c + 1])){
							if(substr($init[$c + 1], 0, 1) == '-'){
								continue;
							} else{
								$combine[$arItem[0]] = $init[$c + 1];
								continue;
							}
						}
					}
				} else {
					$combine[] = $item;
				}
			}

			self::validate($arParams['params'], $combine);

			$class = $commands[$type[0]][$type[1]]['class'];
			if (substr($class, 0, 1) != '\\'){
				$class = __NAMESPACE__.'\\Scripts\\'.$class;
			}

			return [
				'command' => $main,
				'params' => $combine,
				'class' => $class,
			];
		}
	}

	/**
	 * @method validate
	 * @param $temple
	 * @param $orig
	 *
	 * @throws Main\ArgumentException
	 */
	private static function validate($temple, $orig)
	{
		$rules = [
			'%s' => '\w+',
			'%d' => '\d+',
		];
		foreach ($orig as $name => $item) {
			if(!is_int($name)){
				preg_match('/'.$name.'\s(.*)|'.$name.'=(.*)/i', $temple, $m);
			} else {
				preg_match('/'.$name.'\s(.*)|'.$name.'=(.*)/i', $temple, $m);
			}
			if ($rules[$m[1]]){
				$rul = $rules[$m[1]];
			} elseif (substr($m[1], 0, 1) == '(' && substr($m[1], -1, 1) == ')') {
				preg_match('@\((.*)\)@', $m[1], $reg);
				$rul = $reg[1];
			}

			if (!empty($rul) && !preg_match("/".$rul."/", $item)){
				throw new Main\ArgumentException('parameter '.$name.' failed validation');
			}
		}
	}

	public static function getHelp()
	{
		$arCommands = self::getAllCommands();

		ProgressBar::showGood('Commands list', true);
		ProgressBar::pre($arCommands);
	}

	/**
	 * @method getException
	 * @param \Exception|Main\ArgumentException$e
	 */
	public static function getException($e)
	{
		echo "\r\n";
		echo "\x1b[31mERROR:\n
		\x1b[31;1m".$e->getMessage()."\r
		\nCode: ".$e->getCode()."
		\rFile: ".$e->getFile()."
		\rLine: ".$e->getLine()."\e[0m\n\n";
	}
}