<?php
/**
 * Created by OOO 1C-SOFT.
 * User: dremin_s
 * Date: 19.12.2016
 */

namespace AB\Tools\Rest;

use Bitrix\Main;

class AjaxResult extends Main\Result
{
	/**
	 * @var Main\ErrorCollection
	 */
	private $systemErrCollection;

	/**
	 * AjaxResult constructor.
	 */
	public function __construct()
	{
		parent::__construct();
		$this->systemErrCollection = new Main\ErrorCollection();
	}

	/**
	 * @method addSystemError
	 * @param Main\Error $error
	 */
	public function addSystemError(Main\Error $error)
	{
		$this->systemErrCollection[] = $error;
		$this->addError(new Main\Error('Системная ошибка. Попробуйте повторить запрос позднее.', Manager::SYSTEM_ERR_CODE));
	}

	/**
	 * @method getSystemErrors
	 * @return array
	 */
	public function getSystemErrors()
	{
		return $this->systemErrCollection->toArray();
	}


	public function getSystemMessages()
	{
		$msg = null;

		/** @var \Bitrix\Main\Error $item */
		foreach ($this->systemErrCollection->toArray() as $item) {
			$msg[] = ['msg'=>$item->getMessage(),'code'=>$item->getCode()];
		}

		return $msg;
	}
	/**
	 * @method getSystemErrorsCollection
	 * @return Main\ErrorCollection
	 */
	public function getSystemErrorsCollection()
	{
		return $this->systemErrCollection;
	}

	/**
	 * Sets data of the result.
	 *
	 * @param mixed $data
	 */
	public function setData($data)
	{
		$this->data = $data;
	}

	/**
	 * Returns data array saved into the result.
	 * @return mixed
	 */
	public function getData()
	{
		return $this->data;
	}


}