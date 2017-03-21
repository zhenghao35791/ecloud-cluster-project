 (function( factory ) {
    if ( typeof define === "function" && define.amd ) {
        define( ["jquery", "./jquery.validate"], factory );
    } else {
        factory( jQuery );
    }
}(function( $ ) {

  /*
 * Translated default messages for the jQuery validation plugin.
 * Locale: ZH (Chinese, 中文 (Zhōngwén), 汉语, 漢語)
 */
$.extend($.validator.messages, {
  required: "不能为空",
  remote: "请修正该字段",
  email: "请输入有效的电子邮件",
  url: "请输入有效的网址",
  date: "请输入有效的日期",
  dateISO: "请输入有效的日期 (YYYY-MM-DD)",
  number: "请输入正确的数字",
  digits: "只可输入数字",
  creditcard: "请输入有效的信用卡号码",
  equalTo: "请再次输入相同的值",
  extension: "请输入有效的后缀",
  maxlength: $.validator.format("请输入一个 长度最多是 {0} 的字符串"),
  minlength: $.validator.format("请输入一个 长度最少是 {0} 的字符串"),
  rangelength: $.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
  range: $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
  max: $.validator.format("请输入不大于 {0} 的数值"),
  min: $.validator.format("请输入不小于 {0} 的数值")
});

//规则名：buga,value检测对像的值  
     $.validator.addMethod("buga", function(value) {  
        return value == "buga";  
    }, 'Please enter "buga"!');  

// 只能输入[0-9]数字
  $.validator.addMethod("isDigits", function(value, element) {       
         return this.optional(element) || /^\d+$/.test(value);       
    }, "只能输入0-9数字"); 
 //规则名：chinese，value检测对像的值，element检测的对像  判断中文字符 
  $.validator.addMethod("isChinese", function(value, element) {       
         return this.optional(element) || /^[\u4e00-\u9fa5]+$/.test(value);       
    }, "匹配汉字");     
// 匹配中文(包括汉字和字符) 
    $.validator.addMethod("isChineseChar", function(value, element) {       
         return this.optional(element) || /^[\u0391-\uFFE5]+$/.test(value);       
    }, "只能包含汉字和字符"); 

  // 判断英文字符
    $.validator.addMethod("isEnglish", function(value, element) {       
         return this.optional(element) || /^[A-Za-z]+$/.test(value);       
    }, "只能包含英文字符");   
 
 //字母数字
 $.validator.addMethod("Stringnum", function(value, element) {
return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
}, "只能包括英文字母和数字");

// 字符验证
 $.validator.addMethod("EstringCheck", function(value, element) {
return this.optional(element) || /^[0-9a-zA-Z_]+$/.test(value);
}, "只能包括英文字母、数字和下划线");

// 字符验证，只能包含中文、英文、数字、下划线等字    
$.validator.addMethod("CstringCheck", function(value, element) {       
         return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5_]+$/.test(value);       
    }, "只接受英文字母、数字、下划线"); 

// 判断是否包含中英文特殊字符，除英文"-_"字符外
$.validator.addMethod("isContainsSpecialChar", function(value, element) {  
         var reg = RegExp(/[(\ )(\`)(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\+)(\=)(\|)(\{)(\})(\')(\:)(\;)(\')(',)(\[)(\])(\.)(\<)(\>)(\/)(\?)(\~)(\！)(\@)(\#)(\￥)(\%)(\…)(\&)(\*)(\（)(\）)(\—)(\+)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\’)(\。)(\，)(\、)(\？)]+/);   
         return this.optional(element) || !reg.test(value);       
    }, "输入不能含有中英文特殊字符");

// 判断是否为合法字符(a-zA-Z0-9-_)
$.validator.addMethod("isRightfulString", function(value, element) {       
         return this.optional(element) || /^[A-Za-z0-9_-]+$/.test(value);       
    }, "请输入合法字符(a-zA-Z0-9-_)"); 

// 字符最小长度验证（一个中文字符长度为2）
$.validator.addMethod("stringMinLength", function(value, element, param) {
var length = value.length;
for ( var i = 0; i < value.length; i++) {
if (value.charCodeAt(i) > 127) {
length++;
}
}
return this.optional(element) || (length >= param);
}, $.validator.format("长度不能小于{0}!"));

// 字符最大长度验证（一个中文字符长度为2）
$.validator.addMethod("stringMaxLength", function(value, element, param) {
var length = value.length;
for ( var i = 0; i < value.length; i++) {
if (value.charCodeAt(i) > 127) {
length++;
}
}
return this.optional(element) || (length <= param);
}, $.validator.format("长度不能大于{0}!"));

// 必须以特定字符串开头验证
$.validator.addMethod("begin", function(value, element, param) {
var begin = new RegExp("^" + param);
return this.optional(element) || (begin.test(value))
}, $.validator.format("必须以'{0}'开头!"));

// 验证两次输入值是否不相同
$.validator.addMethod("notEqualTo", function(value, element, param) {
return value != $(param).val();
}, $.validator.format("两次输入不能相同!"));

//验证值不允许与特定值等于
$.validator.addMethod("notAllow", function(value, element, param) {
return value != param;
}, $.validator.format("输入值不允许为'{0}'!"));

// 验证值必须大于特定值(不能等于)
$.validator.addMethod("gt", function(value, element, param) {
return value > param;
}, $.validator.format("输入值必须大于{0}!"));

//规则名：byteRangeLength，value检测对像的值，element检测的对像,param参数  
$.validator.addMethod("byteRangeLength", function(value, element, param) {  
        var length = value.length;  
        for (var i = 0; i < value.length; i++) {  
            if (value.charCodeAt(i) > 127) {  
                length++;  
            }  
        }  
        return this.optional(element) || (length >= param[0] && length <= param[1]);  
    }, $.validator.format("请确保输入的值在{0}-{1}个字节之间(一个中文字算2个字节)"));  
 

 // 匹配密码，以字母开头，长度在6-12之间，只能包含字母、数字和下划线。
 $.validator.addMethod("isPwd", function(value, element) {   
          var result =   /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,32}$/.test(value);  
         return this.optional(element) || result; 
    }, "必须同时含字母和数字且长度要在8-32位之间，空格无效"); 
// 手机号码验证    
 $.validator.addMethod("isMobile", function(value, element) {    
      var length = value.length;    
      return this.optional(element) || (length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value));    
    }, "请输入正确的手机号码");

// 电话号码验证    
 $.validator.addMethod("isTel", function(value, element) {    
      var tel = /^(\d{3,4}-?)?\d{7,9}$/g;    
      return this.optional(element) || (tel.test(value));    
  }, "请输入正确的电话号码");

// 联系电话(手机/电话皆可)验证   
 $.validator.addMethod("isPhone", function(value,element) {   
        var length = value.length;   
        var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;   
        var tel = /^(\d{3,4}-?)?\d{7,9}$/g;       
        return this.optional(element) || tel.test(value) || (length==11 && mobile.test(value));   
}, "请输入正确的联系方式"); 

// 邮政编码验证
 $.validator.addMethod("isZipCode", function(value, element) {
var tel = /^[0-9]{6}$/;
return this.optional(element) || (tel.test(value));
}, "请输入正确的邮政编码");

// 身份证号码验证
$.validator.addMethod("isIdCardNo", function(value, element) { 
      //var idCard = /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/;   
      return this.optional(element) || isIdCardNo(value);    
    }, "请输入正确的身份证号码。"); 

//身份证号码的验证规则
    function isIdCardNo(num){ 
 //if (isNaN(num)) {alert("输入的不是数字！"); return false;} 
    　　 var len = num.length, re; 
    　　 if (len == 15) 
    　　 re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{2})(\w)$/); 
    　　 else if (len == 18) 
    　　 re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/); 
    　　 else {
            //alert("输入的数字位数不对。"); 
            return false;
        } 
    　　 var a = num.match(re); 
    　　 if (a != null) 
    　　 { 
    　　 if (len==15) 
    　　 { 
    　　 var D = new Date("19"+a[3]+"/"+a[4]+"/"+a[5]); 
    　　 var B = D.getYear()==a[3]&&(D.getMonth()+1)==a[4]&&D.getDate()==a[5]; 
    　　 } 
    　　 else 
    　　 { 
    　　 var D = new Date(a[3]+"/"+a[4]+"/"+a[5]); 
    　　 var B = D.getFullYear()==a[3]&&(D.getMonth()+1)==a[4]&&D.getDate()==a[5]; 
    　　 } 
    　　 if (!B) {
            //alert("输入的身份证号 "+ a[0] +" 里出生日期不对。"); 
            return false;
        } 
    　　 } 
    　　 if(!re.test(num)){
            //alert("身份证最后一位只能是数字和字母。");
            return false;
        }
    　　 return true; 
    } 

    function ipStatusCheck(value,element){
    	
    	try{
    		
    	    var icpStatus=$(element).attr("icpStatus");
			if(icpStatus==null || icpStatus==undefined){
				
				icpStatus="3";
			}
    		if(/^\d+$/.test(value)==false){
    			
    			return false;
    		}
    		if(value<0 || value>65536){
    			
    			return false;
    			
    		}else {
    			
    			if(value==22 || value==3389){
        			
        			return false;
    			}
    			
    			if(icpStatus !="3"){
    				
    				if(value==80 || value==8080 || value==443 || value==8443){
    					
    					return false;
    				}
    			}
    			
    		}
    		
    		return true;
    	}catch(err){
    		
    		return false;
    	}
    }

// IPv4地址验证  
$.validator.addMethod("isIPv4", function(value, element) {
    return this.optional(element) || /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value);
}, "请输入正确的IP地址(如果没有可选的IP,请购买公网IP)!");

// IPv6地址验证  
$.validator.addMethod("isIPv6", function(value, element) {
    return this.optional(element) || /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(value);
}, "请输入正确的IPv6地址!");

$.validator.addMethod("isPort", function(value, element) {
	
    return this.optional(element) || ipStatusCheck(value,element);
}, "有效端口范围为1~65535(不允许使用22或3389；目的IP未备案时，不允许使用80、8080、443或8443)!");
//ip范围地址验证，与consol业务相关  
$.validator.addMethod("isIpr", function(value, element) {
    return this.optional(element) || /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/(([1-9])|([1-9][0-9])|(1[0-1][0-9]|12[0-8]))){0,1}$/i.test(value);
}, "请输入正确的来源范围!");
$.validator.addMethod("isPort2", function(value, element) {
    return this.optional(element) || /^\d+(:\d+){0,1}$/i.test(value);
}, "请输入正确的端口或范围!");
//检查周期isCheckPeriodic
$.validator.addMethod("isCheckPeriodic", function(value, element) {
    return this.optional(element) || (value>3 && value<30);
}, "检查周期必须在3-30!");

//字符验证，只能包含中文、英文、数字、下划线等字 
$.validator.addMethod("isNameCheck", function(value, element) { 

    return this.optional(element) || (/^[a-zA-Z0-9\u4e00-\u9fa5_]{5,20}$/.test(value));       
    }, "名称只能为5~20的中文、英文、数字、下划线等的组合"); 

}))