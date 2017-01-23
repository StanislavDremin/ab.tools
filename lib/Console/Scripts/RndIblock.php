<?php
/**
 * Created by OOO 1C-SOFT.
 * User: GrandMaster
 * Date: 29.11.2016
 */

namespace AB\Tools\Console\Scripts;

use Bitrix\Main\Loader;
use Bitrix\Main\Web\HttpClient;
use Bitrix\Main\IO;
use AB\Tools\Console\ProgressBar;

Loader::includeModule('iblock');

class RndIblock implements IConsole
{
	/**
	 * @var array - массив параметров CLI
	 */
	protected $params;

	protected $iblockId = null;
	protected $cntSection = null;
	protected $cntElement = null;
	protected $img = true;

//	const TEXT_SITE = 'https://yandex.ru/referats/';
	const TEXT_SITE = 'http://online-generators.ru/ajax.php';
	const IMG_SITE = 'https://unsplash.it/1024/?random';

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

		$iblockId = intval($this->params['params']['-id']);
		if($iblockId == 0){
			throw new \Exception('IBLOCK_ID is null');
		}

		$this->img = strtolower($this->params['params']['-img']) == 'y' ?  true : false;
		$this->iblockId = $iblockId;
		$this->cntSection = intval($this->params['params']['-count_section']) ? $this->params['params']['-count_section'] : 0;
		$this->cntElement = intval($this->params['params']['-count_el']) ? $this->params['params']['-count_el'] : 10;

		$CIBlockSection = new \CIBlockSection();

		/**
		 * paragraph:3
		word:60
		type:science
		processor:text
		 *
		 */
		$arSections = [];

		if($this->cntSection > 0){
			for($i = 0; $i < $this->cntSection; $i++){
				$nameSection = 'Раздел '.randString(10, '0123456789');
				$save = [
					'NAME' => $nameSection,
					'CODE' => \CUtil::translit($nameSection, 'ru'),
					'IBLOCK_ID' => $iblockId,
					'DEPTH_LEVEL' => 1
				];
				$sectionId = $CIBlockSection->Add($save);
				if(intval($sectionId) > 0){
					for ($j = 0; $j < $this->cntElement; $j++){
						$this->generateElement($sectionId);
					}
				}
			}
		} else {
			for ($j = 0; $j < $this->cntElement; $j++){
				$this->generateElement();
			}
		}

		ProgressBar::showGood('All text generate');
	}

	protected function generateElement($sectionId = false)
	{
		$CIBlockElement = new \CIBlockElement();

		$nameEl = "Элемент ".randString(10, '0123456789');;
		$saveEl = [
			'IBLOCK_ID' => $this->iblockId,
			'NAME' => $nameEl,
			'CODE' => \CUtil::translit($nameEl, 'ru'),
			'IBLOCK_SECTION_ID' => $sectionId,
			'PREVIEW_TEXT_TYPE' => 'html',
			'DETAIL_TEXT_TYPE' => 'html',
		];
		$Client = new HttpClient();
		$res = $Client->post(self::TEXT_SITE, [
			'paragraph' => 3,
			'word' => 60,
			'type' => 'science',
			'processor' => 'text'
		]);

		preg_match('#<[a-zA-Z]+>(.*)<\/[a-zA-Z]+>#U', $res, $prevText);
		$saveEl['PREVIEW_TEXT'] = $prevText[1];
		$saveEl['DETAIL_TEXT'] = $res;

		if($this->img === true){
			$Client = new HttpClient();
			$Dir = new IO\Directory($_SERVER['DOCUMENT_ROOT'].'/upload/tmp/gen');
			$Dir->create();
			$Client->download(self::IMG_SITE, $Dir->getPhysicalPath().'/test.jpg');
			$saveEl['DETAIL_PICTURE'] = \CFile::MakeFileArray($Dir->getPhysicalPath().'/test.jpg');
		}

		$element = $CIBlockElement->Add($saveEl);
		if(intval($element) == 0){
			ProgressBar::showError(strip_tags($CIBlockElement->LAST_ERROR));
		}
	}

}