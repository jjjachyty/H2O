export function deepCopy(state){
  let result
  if (typeof state === 'object'){
    if(Array.isArray(state)){
      result = []
      for(let i in state){
        result.push(deepCopy(state[i]))
      }
    }else if(state === null){
      result = null
    }else if(state.constructor===RegExp){
      result = state
    }else{
      result = {}
      for(let key in state){
        result[key] = deepCopy(state[key])
      }
    }
  }else {
    result = state
  }

  return result
}

// 小数点位数处理
export function toFixed(val,len) {
  var f = parseFloat(val);
  if (isNaN(f)) {
      return false;
  }
  var s=val.toString();
  if(s.indexOf(".")>0){
      var f = s.split(".")[1].substring(0,len)
      s=s.split(".")[0]+"."+f
  }
  var rs = s.indexOf('.');
  if (rs < 0) {
      rs = s.length;
      s += '.';
  }
  while (s.length <= rs + len) {
      s += '0';
  }
  return s || '--';
}
export function toWei(amount, decimal) {
  let str = 'ether'
  switch (Number(decimal)) {
    case 18:
      str = 'ether'
      break;
    case 6:
      str = 'mwei';
      break;
  }
  return web3.utils.toWei(amount.toString(), str)
}
export function fromWei(amount, decimal) {
  let str = 'ether'
  switch (Number(decimal)) {
    case 18:
      str = 'ether'
      break;
    case 6:
      str = 'mwei';
      break;
  }
  return web3.utils.fromWei(amount.toString(), str)
}

export const $inputLimit = function (e, point , isModel) {
  if (point > 0) { //小数 ^(\-)*(\d+)\.(\d{1,3}).*$
    e.target.value = e.target.value.replace(/[^\d.]/g, "")  //清除“数字”和“.”以外的字符
      .replace(/^\./g, "") //验证第一个字符是数字
      .replace(/\.{2,}/g, ".") //只保留第一个. 清除多余的
      .replace(".", "$#$").replace(/\./g, "").replace("$#$", ".")
      .replace(new RegExp(`^(\\-)*(\\d+)\\.(\\d{1,${point}}).*$`), '$1$2.$3');//只能输入两个小数
  } else { //整数
    if (e.target.value.length == 1) {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
    } else {
      e.target.value = e.target.value.replace(/[^\d]/g, "");
    }
  }
  if (e.target.value.indexOf(".") < 0 && e.target.value != "") { //此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    // e.target.value = parseFloat(e.target.value);
    let text = e.target.value
    let leng = text.length
    for(let i=0;i<leng;i++){
      if(text.charAt(i) !== '0' || i === leng-1){
        e.target.value = text.substring(i)
        break
      }
    }
  }
  if(isModel) return String(e.target.value)
};

export function toolNumber(num_str) {
  num_str = num_str.toString();
  if (num_str.indexOf("+") != -1) {
    num_str = num_str.replace("+", "");
  }
  if (num_str.indexOf("E") != -1 || num_str.indexOf("e") != -1) {
    var resValue = "",
      power = "",
      result = null,
      dotIndex = 0,
      resArr = [],
      sym = "";
    var numStr = num_str.toString();
    if (numStr[0] == "-") {
      //如果为负数，转成正数处理，先去掉‘-’号，并保存‘-’.
      numStr = numStr.substr(1);
      sym = "-";
    }
    if (numStr.indexOf("E") != -1 || numStr.indexOf("e") != -1) {
      var regExp = new RegExp(
        "^(((\\d+.?\\d+)|(\\d+))[Ee]{1}((-(\\d+))|(\\d+)))$",
        "ig"
      );
      result = regExp.exec(numStr);
      if (result != null) {
        resValue = result[2];
        power = result[5];
        result = null;
      }
      if (!resValue && !power) {
        return false;
      }
      dotIndex = resValue.indexOf(".") == -1 ? 0 : resValue.indexOf(".");
      resValue = resValue.replace(".", "");
      resArr = resValue.split("");
      if (Number(power) >= 0) {
        var subres = resValue.substr(dotIndex);
        power = Number(power);
        //幂数大于小数点后面的数字位数时，后面加0
        for (var i = 0; i <= power - subres.length; i++) {
          resArr.push("0");
        }
        if (power - subres.length < 0) {
          resArr.splice(dotIndex + power, 0, ".");
        }
      } else {
        power = power.replace("-", "");
        power = Number(power);
        //幂数大于等于 小数点的index位置, 前面加0
        for (var i = 0; i < power - dotIndex; i++) {
          resArr.unshift("0");
        }
        var n = power - dotIndex >= 0 ? 1 : -(power - dotIndex);
        resArr.splice(n, 0, ".");
      }
    }
    resValue = resArr.join("");
    return sym + resValue;
  } else {
    return num_str;
  }
}