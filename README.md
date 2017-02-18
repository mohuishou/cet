# cet
> 免证四六级查询，准考证号接口来自99宿舍，成绩接口来自学信网

--------

## 测试
> 模拟测试50用户，每秒一次请求，连续五分钟情况下，完全通过

## 安装

*安装条件：node >4.0.0 gcc>4.8.0*

```
git clone
npm install
cd ling-cet-decoder
npm install
cd ..
node index.js
```

## 接口
```javascript
//有准考证查询

url: /grade
method:post
body: {
	name:"张三", //姓名
	id:123456789123456 //准考证号
}

//无准考证号查询
url :/gradeNoId
method:post
body: {
	name:"张三", //姓名
	school:"xx大学", //学校
	type:1 //考试等级1：四级，2：六级
}
```

## 感谢
[ling-cet-decoder](https://github.com/wssgcg1213/ling-cet-decoder) 的99宿舍接口

## CHANGELOG

### 0.2.0 beta
添加代理ip
todo：实现代理ip地址池

### 之前
由于某网站修改了加密密钥，所以之前获取准考证号会出错，现在已经基本可用
安装方式有些修改需要重新安装