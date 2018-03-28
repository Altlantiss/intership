/*
 *@author:xiecanyong
 *@process.version:v3.5.2
 *@function:some new common function about localStorage
 */


/*
 *@function:写入localStorage
 *@param1:name[string] 本地存储的名称
 *@param2:value[string||int] 本地存储的值
 */
function setLocalStorage(name,value){
	var storage=window.localStorage;
	value=JSON.stringify(value);
	storage.setItem(name,value);
}

/*
 *@function:获取localStorage
 *@param1:name[string] 本地存储的名称
 */
function getLocalStorage(name){
	var storage=window.localStorage;
	var getItem=trimDouble(storage.getItem(name));
	if(getItem==null){
		//console.error('getLocalStorage:your input name is not exits');
		return false;
	}
	return getItem;
}

/*
 *@function:获取本地存储中JSON格式中的特定值
 *@param1:指定查找的本地存储中的某个字段
 *@param2:指定要获取的本地存储中的某个值
 */
function getSectionStorage(orgin,str){
	var storage=window.localStorage;
	var orgin=trimDouble(storage.getItem(orgin));
	if(orgin==null){
		//console.error('getSectionStorage:'+orgin+' is not exits');
		return false;
	}
	var index=orgin.indexOf(str);
	var returnStr;
	if(index!=-1){
		orgin=JSON.parse(orgin);
		for(var key in orgin){
			if(key==str){
				returnStr=orgin[key];
				return returnStr;
			}
		}
	}else{
		//console.error("getSectionStorage is not exits filed");
	}
}

/*
 *@function:修改本地JSON数据格式的某个字段
 *@param1:指定查找本地存储中的字段
 *@param2:指定要修改的本地存储中的某个值
 *@param3:修改后的值
 */
function setSectionStorage(orgin,name,value){
	var storage=window.localStorage;
	var orgin1=trimDouble(storage.getItem(orgin));
	var index=orgin1.indexOf(name);
	var returnStr;
	var reg=/:.+[\,,}]/gi;
	if(index!=-1){
		orgin1=JSON.parse(orgin1);
		for(var key in orgin1){
			if(key==name){
				orgin1[key]=value;
				window.localStorage.removeItem(orgin);
				window.localStorage.setItem(orgin,JSON.stringify(orgin1));
			}
		}
	}else{
		//console.error("setSectionStorage is not exits filed");
	}
}


/*
 *@function:去除本地存储读取时候添加双引号的问题
 *@param1: str[string] 本地存储读取出来的参数
 */
function trimDouble(str){
	var reg=/^\".+\"$/gi;
	var bool=reg.test(str);
	var returnStr;
	if(bool){
		returnStr=str.substr(1,str.length-2);
	}else{
		returnStr=str;
	}
	return returnStr;

}