layui.define(['realsuntime'], function (exports) {

    //720课
    var _720KE = { "甲子": { "子": "戌申午", "丑": "子亥戌", "寅": "寅巳申", "卯": "辰巳午", "辰": "辰午申", "巳": "申亥寅", "午": "申亥寅", "未": "辰申子", "申": "子巳戌", "酉": "寅申寅", "戌": "寅酉辰", "亥": "戌午寅" }, "乙丑": { "子": "巳丑酉", "丑": "丑戌未", "寅": "亥酉未", "卯": "子亥戌", "辰": "辰丑戌", "巳": "寅卯辰", "午": "申戌子", "未": "未戌丑", "申": "酉丑巳", "酉": "寅未子", "戌": "戌辰戌", "亥": "卯戌巳" }, "丙寅": { "子": "子未寅", "丑": "戌午寅", "寅": "亥申巳", "卯": "丑亥酉", "辰": "子亥戌", "巳": "巳申寅", "午": "辰巳午", "未": "辰午申", "申": "申亥寅", "酉": "酉丑巳", "戌": "子巳戌", "亥": "寅申寅" }, "丁卯": { "子": "巳戌卯", "丑": "卯酉卯", "寅": "戌巳子", "卯": "未卯亥", "辰": "子酉午", "巳": "亥酉未", "午": "丑子亥", "未": "卯子午", "申": "辰巳午", "酉": "酉亥丑", "戌": "酉子卯", "亥": "亥卯未" }, "戊辰": { "子": "子未寅", "丑": "子申辰", "寅": "寅亥申", "卯": "丑亥酉", "辰": "卯寅丑", "巳": "巳申寅", "午": "寅午午", "未": "申戌子", "申": "亥寅巳", "酉": "子辰申", "戌": "寅未子", "亥": "亥巳亥" }, "己巳": { "子": "巳戌卯", "丑": "巳亥巳", "寅": "酉辰亥", "卯": "卯亥未", "辰": "寅亥申", "巳": "丑亥酉", "午": "卯寅丑", "未": "巳申寅", "申": "申申午", "酉": "亥丑卯", "戌": "申亥寅", "亥": "酉丑巳" }, "庚午": { "子": "辰申子", "丑": "辰酉寅", "寅": "寅申寅", "卯": "戌巳子", "辰": "子申辰", "巳": "巳寅亥", "午": "寅子戌", "未": "午巳辰", "申": "申寅巳", "酉": "戌未酉", "戌": "申戌子", "亥": "酉子卯" }, "辛未": { "子": "寅辰午", "丑": "亥丑丑", "寅": "亥卯未", "卯": "巳戌卯", "辰": "巳丑辰", "巳": "酉辰亥", "午": "卯亥未", "未": "亥未未", "申": "午辰寅", "酉": "巳辰卯", "戌": "未丑戌", "亥": "申亥寅" }, "壬申": { "子": "丑寅卯", "丑": "子寅辰", "寅": "巳申亥", "卯": "未亥卯", "辰": "辰酉寅", "巳": "寅申寅", "午": "午丑申", "未": "子申辰", "申": "巳寅亥", "酉": "午辰寅", "戌": "戌酉申", "亥": "亥申寅" }, "癸酉": { "子": "未午巳", "丑": "丑戌未", "寅": "亥子丑", "卯": "丑卯巳", "辰": "辰未戌", "巳": "酉丑巳", "午": "未子巳", "未": "卯酉卯", "申": "亥午丑", "酉": "巳丑酉", "戌": "午卯子", "亥": "未巳卯" }, "甲戌": { "子": "午辰寅", "丑": "子亥戌", "寅": "寅巳申", "卯": "辰巳午", "辰": "辰午申", "巳": "申亥寅", "午": "寅午戌", "未": "子巳戌", "申": "寅申寅", "酉": "子未寅", "戌": "戌午寅", "亥": "申巳寅" }, "乙亥": { "子": "未卯亥", "丑": "丑戌未", "寅": "酉未巳", "卯": "戌酉申", "辰": "辰亥巳", "巳": "丑寅卯", "午": "申戌子", "未": "未戌丑", "申": "未亥卯", "酉": "寅未子", "戌": "巳亥巳", "亥": "午丑申" }, "丙子": { "子": "子未寅", "丑": "申辰子", "寅": "午卯子", "卯": "丑亥酉", "辰": "戌酉申", "巳": "巳申寅", "午": "寅卯辰", "未": "辰午申", "申": "申亥寅", "酉": "酉丑巳", "戌": "巳戌卯", "亥": "午子午" }, "丁丑": { "子": "巳戌卯", "丑": "亥未丑", "寅": "卯戌巳", "卯": "巳丑酉", "辰": "子辰戌", "巳": "亥酉未", "午": "子亥戌", "未": "丑戌未", "申": "申酉戌", "酉": "酉亥丑", "戌": "午戌辰", "亥": "酉丑巳" }, "戊寅": { "子": "子未寅", "丑": "戌午寅", "寅": "寅亥申", "卯": "丑亥酉", "辰": "子亥戌", "巳": "巳申寅", "午": "辰巳午", "未": "辰午申", "申": "申亥寅", "酉": "丑午酉", "戌": "子巳戌", "亥": "寅申寅" }, "己卯": { "子": "巳戌卯", "丑": "卯酉卯", "寅": "戌巳子", "卯": "未卯亥", "辰": "子酉午", "巳": "亥酉未", "午": "丑子亥", "未": "卯子午", "申": "辰巳午", "酉": "亥丑卯", "戌": "酉子卯", "亥": "亥卯未" }, "庚辰": { "子": "辰申子", "丑": "寅未子", "寅": "寅申寅", "卯": "午丑申", "辰": "子申辰", "巳": "巳寅亥", "午": "寅子戌", "未": "卯寅丑", "申": "申寅巳", "酉": "午未申", "戌": "申戌子", "亥": "寅巳申" }, "辛巳": { "子": "寅辰午", "丑": "申亥寅", "寅": "酉丑巳", "卯": "卯申丑", "辰": "巳亥巳", "巳": "未寅酉", "午": "午寅戌", "未": "寅亥申", "申": "丑亥酉", "酉": "卯寅丑", "戌": "巳申寅", "亥": "午未申" }, "壬午": { "子": "丑寅卯", "丑": "申戌子", "寅": "酉子卯", "卯": "未亥卯", "辰": "辰酉寅", "巳": "午子午", "午": "午丑申", "未": "戌午寅", "申": "巳寅亥", "酉": "寅子戌", "戌": "戌酉申", "亥": "亥午子" }, "癸未": { "子": "巳辰卯", "丑": "丑戌未", "寅": "申寅申", "卯": "巳未酉", "辰": "辰未戌", "巳": "酉丑巳", "午": "巳戌卯", "未": "未丑未", "申": "卯戌巳", "酉": "卯亥未", "戌": "戌未辰", "亥": "巳卯丑" }, "甲申": { "子": "午辰寅", "丑": "子亥戌", "寅": "寅巳申", "卯": "辰巳午", "辰": "辰午申", "巳": "申亥寅", "申": "辰申子", "酉": "子巳戌", "戌": "寅申寅", "亥": "戌巳子" }, "乙酉": { "子": "巳丑酉", "丑": "丑戌未", "寅": "未巳卯", "卯": "申未午", "辰": "辰酉卯", "巳": "亥子丑", "午": "申戌子", "未": "未戌丑", "申": "申子辰", "酉": "未子巳", "戌": "卯酉卯", "亥": "亥午丑" }, "丙戌": { "子": "子未寅", "丑": "酉巳丑", "寅": "亥申巳", "卯": "丑亥酉", "辰": "卯寅丑", "巳": "巳申寅", "午": "亥子丑", "未": "子寅辰", "申": "申亥寅", "酉": "酉丑巳", "戌": "申丑午", "亥": "巳亥巳" }, "丁亥": { "子": "巳戌卯", "丑": "巳亥巳", "寅": "午丑申", "卯": "未卯亥", "辰": "巳亥寅", "巳": "酉未巳", "午": "戌酉申", "未": "亥未丑", "申": "申酉戌", "酉": "酉亥丑", "戌": "午戌寅", "亥": "未亥卯" }, "戊子": { "子": "子未寅", "丑": "巳申丑", "寅": "寅亥申", "卯": "丑亥酉", "辰": "戌酉申", "巳": "巳申寅", "午": "寅卯辰", "未": "辰午申", "申": "卯午酉", "酉": "辰申子", "戌": "巳戌卯", "亥": "午子午" }, "己丑": { "子": "巳戌卯", "丑": "亥未丑", "寅": "卯戌巳", "卯": "卯亥未", "辰": "子辰戌", "巳": "亥酉未", "午": "子亥戌", "未": "丑戌未", "申": "寅卯辰", "酉": "卯巳未", "戌": "午戌辰", "亥": "酉丑巳" }, "庚寅": { "子": "辰申子", "丑": "子巳戌", "寅": "寅申寅", "卯": "戌巳子", "辰": "子申辰", "巳": "巳寅亥", "午": "午辰寅", "未": "子亥戌", "申": "申寅巳", "酉": "辰巳午", "戌": "辰午申", "亥": "申亥寅" }, "辛卯": { "子": "巳未酉", "丑": "酉子卯", "寅": "亥卯未", "卯": "卯申丑", "辰": "卯酉卯", "巳": "戌巳子", "午": "未卯亥", "未": "子未子", "申": "亥酉未", "酉": "丑子亥", "戌": "卯子午", "亥": "辰巳午" }, "壬辰": { "子": "丑寅卯", "丑": "申戌子", "寅": "戌丑辰", "卯": "未亥卯", "辰": "寅未子", "巳": "巳亥巳", "午": "午丑申", "未": "子申辰", "申": "巳寅亥", "酉": "寅子戌", "戌": "戌酉申", "亥": "亥辰戌" }, "癸巳": { "子": "卯寅丑", "丑": "丑戌未", "寅": "未申酉", "卯": "未酉亥", "辰": "申亥寅", "巳": "酉丑巳", "午": "午亥辰", "未": "巳亥巳", "申": "卯戌巳", "酉": "巳丑酉", "戌": "戌未辰", "亥": "丑亥酉" }, "甲午": { "子": "寅子戌", "丑": "子亥戌", "寅": "寅巳申", "卯": "辰巳午", "辰": "辰午申", "巳": "申亥寅", "午": "寅午戌", "未": "子巳戌", "申": "寅申寅", "酉": "酉辰亥", "戌": "戌午寅", "亥": "申巳寅" }, "乙未": { "子": "卯亥未", "丑": "丑戌未", "寅": "亥寅巳", "卯": "戌卯午", "辰": "辰未丑", "巳": "酉戌亥", "午": "申戌子", "未": "未戌丑", "申": "亥卯未", "酉": "巳戌卯", "戌": "戌辰戌", "亥": "午丑申" }, "丙申": { "子": "戌巳子", "丑": "子申辰", "寅": "巳寅亥", "卯": "丑亥酉", "辰": "卯寅丑", "巳": "巳申寅", "午": "酉戌亥", "未": "子寅辰", "申": "申亥寅", "酉": "酉丑巳", "戌": "卯申丑", "亥": "寅申寅" }, "丁酉": { "子": "未子巳", "丑": "卯酉卯", "寅": "亥午丑", "卯": "巳丑酉", "辰": "午卯子", "巳": "丑巳巳", "午": "申未午", "未": "酉未丑", "申": "亥子丑", "酉": "酉亥丑", "戌": "子卯午", "亥": "亥卯未" }, "戊戌": { "子": "子未寅", "丑": "寅戌午", "寅": "寅亥申", "卯": "丑亥酉", "辰": "卯寅丑", "巳": "巳申寅", "午": "亥子丑", "未": "子寅辰", "申": "亥寅巳", "酉": "寅午戌", "戌": "申丑午", "亥": "亥巳亥" }, "己亥": { "子": "巳戌卯", "丑": "巳亥巳", "寅": "午丑申", "卯": "未卯亥", "辰": "巳寅亥", "巳": "卯丑亥", "午": "戌酉申", "未": "亥未丑", "申": "丑寅卯", "酉": "丑卯巳", "戌": "寅巳申", "亥": "亥卯未" }, "庚子": { "子": "辰申子", "丑": "巳戌卯", "寅": "寅申寅", "卯": "戌巳子", "辰": "子申辰", "巳": "午卯子", "午": "午辰寅", "未": "戌酉申", "申": "申寅巳", "酉": "寅卯辰", "戌": "辰午申", "亥": "午酉子" }, "辛丑": { "子": "卯巳未", "丑": "巳丑丑", "寅": "酉丑巳", "卯": "卯申丑", "辰": "亥未辰", "巳": "卯戌巳", "午": "巳丑酉", "未": "巳未未", "申": "亥酉未", "酉": "子亥戌", "戌": "丑戌未", "亥": "寅卯辰" }, "壬寅": { "子": "辰巳午", "丑": "辰午申", "寅": "申亥寅", "卯": "未亥卯", "辰": "子巳戌", "巳": "寅申寅", "午": "午丑申", "未": "戌午寅", "申": "巳寅亥", "酉": "戌申午", "戌": "子亥戌", "亥": "亥寅巳" }, "癸卯": { "子": "丑子亥", "丑": "丑戌未", "寅": "辰巳午", "卯": "未酉亥", "辰": "酉子卯", "巳": "酉丑巳", "午": "午亥辰", "未": "卯酉卯", "申": "卯戌巳", "酉": "未亥卯", "戌": "戌未辰", "亥": "亥酉未" }, "甲辰": { "子": "寅子戌", "丑": "子亥戌", "寅": "寅巳申", "卯": "辰巳午", "辰": "辰午申", "巳": "申亥寅", "午": "申子辰", "未": "子巳戌", "申": "寅申寅", "酉": "午丑申", "戌": "子申辰", "亥": "申巳寅" }, "乙巳": { "子": "酉巳丑", "丑": "丑戌未", "寅": "丑亥酉", "卯": "卯寅丑", "辰": "辰巳申", "巳": "未申酉", "午": "申戌子", "未": "未戌丑", "申": "酉丑巳", "酉": "寅未子", "戌": "巳亥巳", "亥": "午丑申" }, "丙午": { "子": "子未寅", "丑": "戌午寅", "寅": "子酉午", "卯": "丑亥酉", "辰": "卯寅丑", "巳": "巳申寅", "午": "申酉戌", "未": "申戌子", "申": "申亥寅", "酉": "酉丑巳", "戌": "辰酉寅", "亥": "午子午" }, "丁未": { "子": "巳戌卯", "丑": "巳丑丑", "寅": "酉辰亥", "卯": "卯亥未", "辰": "亥辰辰", "巳": "丑巳巳", "午": "卯午午", "未": "未丑戌", "申": "申酉戌", "酉": "酉亥丑", "戌": "亥戌戌", "亥": "亥卯未" }, "戊申": { "子": "子未寅", "丑": "子申辰", "寅": "寅亥申", "卯": "丑亥酉", "辰": "卯寅丑", "巳": "巳申寅", "午": "戌酉午", "未": "子寅辰", "申": "寅巳申", "酉": "辰申子", "戌": "卯申丑", "亥": "寅申寅" }, "己酉": { "子": "未子巳", "丑": "卯酉卯", "寅": "亥午丑", "卯": "卯亥未", "辰": "午卯子", "巳": "卯丑亥", "午": "戌午申", "未": "酉未丑", "申": "亥子丑", "酉": "丑卯巳", "戌": "卯午酉", "亥": "亥卯未" }, "庚戌": { "子": "辰申子", "丑": "申丑午", "寅": "寅申寅", "卯": "戌巳子", "辰": "子申辰", "巳": "巳寅亥", "午": "午辰寅", "未": "午巳辰", "申": "申寅巳", "酉": "亥子丑", "戌": "子寅辰", "亥": "寅巳申" }, "辛亥": { "子": "丑卯巳", "丑": "巳申亥", "寅": "未亥卯", "卯": "卯申丑", "辰": "巳亥巳", "巳": "午丑申", "午": "未卯亥", "未": "巳寅亥", "申": "午辰寅", "酉": "戌酉申", "戌": "亥戌未", "亥": "丑寅卯" }, "壬子": { "子": "寅卯辰", "丑": "辰午申", "寅": "午酉子", "卯": "未亥卯", "辰": "巳戌卯", "巳": "午子午", "午": "午丑申", "未": "未卯亥", "申": "午卯子", "酉": "戌申午", "戌": "戌酉申", "亥": "亥子卯" }, "癸丑": { "子": "子亥戌", "丑": "丑戌未", "寅": "寅卯辰", "卯": "卯巳未", "辰": "辰未戌", "巳": "酉丑巳", "午": "午亥辰", "未": "未丑未", "申": "卯戌巳", "酉": "巳丑酉", "戌": "戌未辰", "亥": "亥酉未" }, "甲寅": { "子": "戌申午", "丑": "子亥戌", "寅": "寅巳申", "卯": "辰巳午", "辰": "辰午申", "巳": "申亥寅", "午": "申午午", "未": "子巳戌", "申": "寅申寅", "酉": "酉辰亥", "戌": "戌午寅", "亥": "丑亥亥" }, "乙卯": { "子": "未卯亥", "丑": "丑戌未", "寅": "亥酉未", "卯": "丑子亥", "辰": "辰卯子", "巳": "辰巳午", "午": "申戌子", "未": "酉子卯", "申": "亥卯未", "酉": "寅未子", "戌": "卯酉卯", "亥": "午丑申" }, "丙辰": { "子": "午丑申", "丑": "子申辰", "寅": "亥申巳", "卯": "丑亥酉", "辰": "卯寅丑", "巳": "巳申寅", "午": "亥午午", "未": "申戌子", "申": "申亥寅", "酉": "酉丑巳", "戌": "寅未子", "亥": "巳亥巳" }, "丁巳": { "子": "巳戌卯", "丑": "巳亥巳", "寅": "酉辰亥", "卯": "亥未卯", "辰": "亥申巳", "巳": "丑亥酉", "午": "卯寅丑", "未": "巳申寅", "申": "申酉戌", "酉": "酉亥丑", "戌": "申亥寅", "亥": "酉丑巳" }, "戊午": { "子": "子未寅", "丑": "戌午申", "寅": "寅亥申", "卯": "丑亥酉", "辰": "卯寅丑", "巳": "巳申寅", "午": "寅午午", "未": "申戌子", "申": "酉子卯", "酉": "寅午戌", "戌": "辰酉寅", "亥": "午子午" }, "己未": { "子": "巳戌卯", "丑": "巳丑丑", "寅": "酉辰亥", "卯": "卯亥未", "辰": "亥辰辰", "巳": "丑巳巳", "午": "卯午午", "未": "未丑戌", "申": "未申申", "酉": "酉酉酉", "戌": "亥戌戌", "亥": "亥卯未" }, "庚申": { "子": "辰申子", "丑": "卯丑丑", "寅": "寅申寅", "卯": "戌巳子", "辰": "子申辰", "巳": "巳寅亥", "午": "午辰寅", "未": "酉未未", "申": "申寅巳", "酉": "亥酉酉", "戌": "子寅辰", "亥": "丑亥亥" }, "辛酉": { "子": "丑卯巳", "丑": "卯午酉", "寅": "寅午戌", "卯": "未子巳", "辰": "卯酉卯", "巳": "亥午丑", "午": "巳丑酉", "未": "午卯子", "申": "午辰寅", "酉": "丑酉酉", "戌": "酉戌未", "亥": "亥子丑" }, "壬戌": { "子": "亥子丑", "丑": "子寅辰", "寅": "辰未戌", "卯": "未亥卯", "辰": "辰酉寅", "巳": "巳亥巳", "午": "午丑申", "未": "未卯亥", "申": "巳寅亥", "酉": "午辰寅", "戌": "戌酉申", "亥": "亥戌未" }, "癸亥": { "子": "戌酉申", "丑": "丑戌未", "寅": "丑寅卯", "卯": "丑卯巳", "辰": "辰未戌", "巳": "酉丑巳", "午": "午亥辰", "未": "巳亥巳", "申": "卯戌巳", "酉": "未卯亥", "戌": "巳寅亥", "亥": "未巳卯" } };

    //月将. 根据节气
    var YUE_JIANG = {
        "雨水": ["亥", "登明"],
        "春分": ["戌", "河魁"],
        "谷雨": ["酉", "从魁"],
        "小满": ["申", "传送"],
        "夏至": ["未", "小吉"],
        "大暑": ["午", "胜光"],
        "处暑": ["巳", "太乙"],
        "秋分": ["辰", "天罡"],
        "霜降": ["卯", "太冲"],
        "小雪": ["寅", "功曹"],
        "冬至": ["丑", "大吉"],
        "大寒": ["子", "神后"],
    };

    var YUE_JIANG2 = [
        ["亥", "登明"],
        ["戌", "河魁"],
        ["酉", "从魁"],
        ["申", "传送"],
        ["未", "小吉"],
        ["午", "胜光"],
        ["巳", "太乙"],
        ["辰", "天罡"],
        ["卯", "太冲"],
        ["寅", "功曹"],
        ["丑", "大吉"],
        ["子", "神后"],
    ]

    var YUE_ZHI = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
    var SHI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    //12月将
    var _12YUEJIANG = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    //12地支
    var _12DIZHI = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];
    //10天干
    var _10TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "〇", "〇"];
    //12神
    var _12SHEN = ["贵", "蛇", "朱", "合", "勾", "龙", "空", "虎", "常", "玄", "阴", "后"];

    var _HOUR_ZHI = {
        "子": 23,
        "丑": 1,
        "寅": 3,
        "卯": 5,
        "辰": 7,
        "巳": 9,
        "午": 11,
        "未": 13,
        "申": 15,
        "酉": 17,
        "戌": 19,
        "亥": 21
    }

    //十干寄宫
    var _10GAN_JIGONG = {
        "甲": "寅",
        "乙": "辰",
        "丙": "巳",
        "丁": "未",
        "戊": "巳",
        "己": "未",
        "庚": "申",
        "辛": "戌",
        "壬": "亥",
        "癸": "丑",
    }

    /**
     * @param {String} gan 日干
     * @param {String} zhi 日支
     * @param {boolean} isDaytime 是否白天
     */
    function tianyiguiren(gan, zhi, isDaytime) {
        const conditions = {
            "甲": ["丑", "未"],
            "戊": ["丑", "未"],
            "庚": ["丑", "未"],
            "乙": ["子", "申"],
            "己": ["子", "申"],
            "丙": ["亥", "酉"],
            "丁": ["亥", "酉"],
            "壬": ["巳", "卯"],
            "癸": ["巳", "卯"],
            "辛": ["午", "寅"]
        };

        if (isDaytime) {
            return conditions[gan][0];
        } else {
            return conditions[gan][1];
        }
    }

    function xing(ez) {
        var returnVal = "";
        if (ez == "子") { returnVal = "卯"; }
        if (ez == "丑") { returnVal = "戌"; }
        if (ez == "寅") { returnVal = "巳"; }
        if (ez == "卯") { returnVal = "子"; }
        if (ez == "巳") { returnVal = "申"; }
        if (ez == "未") { returnVal = "丑"; }
        if (ez == "申") { returnVal = "寅"; }
        if (ez == "戌") { returnVal = "未"; }
        if (ez == "辰") { returnVal = "戌"; }
        if (ez == "午") { returnVal = "子"; }
        if (ez == "酉") { returnVal = "卯"; }
        if (ez == "亥") { returnVal = "巳"; }
        return returnVal;
    }

    /**
     * 将数组包装成一个可循环遍历的对象，支持循环遍历。
     * @param {Array} array 数组
     * @param {int} curIndex 起始位置
     * @param {boolean} isForward 遍历方向，true为正向，false为反向
     * @returns 
     */
    function CircularList(array, curIndex, isForward = true) {
        var currentIndex = curIndex;
        var length = array.length;

        function next() {
            if (length === 0) {
                return null;
            }

            var currentItem = array[currentIndex];

            // 根据 isForward 参数决定下一个索引的方向
            currentIndex = isForward ? (currentIndex + 1) % length
                : (currentIndex - 1 + length) % length;

            return currentItem;
        }

        return {
            next: next
        };
    }

    /**
     * @param {string} gan 天干
     * @param {string} zhi 地支
     * return 六亲关系
     */
    function get6qinRelation(gan, zhi) {
        const wuxingRelations = {
            "木": { "生我": "水", "我生": "火", "同我": "木", "克我": "金", "我克": "土" },
            "火": { "生我": "木", "我生": "土", "同我": "火", "克我": "水", "我克": "金" },
            "土": { "生我": "火", "我生": "金", "同我": "土", "克我": "木", "我克": "水" },
            "金": { "生我": "土", "我生": "水", "同我": "金", "克我": "火", "我克": "木" },
            "水": { "生我": "金", "我生": "木", "同我": "水", "克我": "土", "我克": "火" }
        };
        const liuQinMap = {
            "同我": "兄",
            "我生": "子",
            "克我": "官",
            "我克": "财",
            "生我": "父"
        };
        var wx1 = tianganWuxing(gan);
        var wx2 = dizhiWuxing(zhi);

        for (const relation in wuxingRelations[wx1]) {
            if (wuxingRelations[wx1][relation] === wx2) {
                return liuQinMap[relation];
            }
        }
    }

    var da6renObj = {

        /**
         * 
         * @param {date} datetime 时间对象
         * @param {boolean} realsun 是否真太阳时
         * @param {string} diqu 地区
         * @param {boolean} isMan 是否男的
         * @param {int} yearMing 年命（出生年份）
         * @param {int} yueJiangMethod 起月将方法，1为节气起，2为年月日时取余
         * @param {int} guirenMethod 取贵神方法，1为按卯酉区分，2为白昼，3为夜晚
         * @param {int} guirenSunni 排12贵神的顺逆方式，1为按贵神所落地盘(亥子丑寅卯辰顺排，巳午未申酉戌逆排)，2为按男女（男顺女逆)
         * @param {string} zhanbuTime 占卜时辰，12地支之一。为空时为当时时间
         * @param {string} yongShen 用神(阴盘六壬用神)
         */
        _init: function (datetime, realsun, diqu, isMan, yearMing, yueJiangMethod = 1, guirenMethod = 1, guirenSunni = 1, zhanbuTime, yongShen) {

            var year = datetime.getFullYear();
            var month = datetime.getMonth() + 1;
            var day = datetime.getDate();
            var hour = datetime.getHours();
            var minute = datetime.getMinutes();
            this.realsun = realsun;
            this.isMan = isMan;
            this.yearMing = yearMing;
            this.yueJiangMethod = yueJiangMethod;
            this.guirenMethod = guirenMethod;
            this.guirenSunni = guirenSunni;
            this.diqu = diqu;
            this.datetime = datetime;
            this.realsunDate;
            if (!!realsun) {//转换为真太阳时
                realsunDate = layui.realsuntime.calcRealsuntime(datetime, diqu);
                year = realsunDate.getFullYear();
                month = realsunDate.getMonth() + 1;
                day = realsunDate.getDate();
                hour = realsunDate.getHours();
                minute = realsunDate.getMinutes();
            }

            this.solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
            this.lunar = this.solar.getLunar();
            this.bazi = this.lunar.getEightChar();

            this.nianZhu = [this.bazi.getYearGan(), this.bazi.getYearZhi()];
            this.yueZhu = [this.bazi.getMonthGan(), this.bazi.getMonthZhi()];
            this.riZhu = [this.bazi.getDayGan(), this.bazi.getDayZhi()];
            this.shiZhu = [this.bazi.getTimeGan(), this.bazi.getTimeZhi()];

            this.zhanbuTime = zhanbuTime;
            this.zhanbuTimeCur = this.zhanbuTime || this.lunar.getEightChar().getTimeZhi();

            this.yongShen = yongShen;

            this._xingYear();

            return this;
        },

        //计算行年
        _xingYear: function () {
            var jiaziYear = getGanzhiYear(this.yearMing);
            var _60jiaziCircular = null;
            if (this.isMan) {
                _60jiaziCircular = CircularList(_jiazhi, 2); //男从丙寅开始
            } else {
                _60jiaziCircular = CircularList(_jiazhi, 32);//女从丙申开始
            }
            var age = new Date().getFullYear() - this.yearMing + 1;
            var xn = "";
            for (var i = 0; i < age; i++) {
                xn = _60jiaziCircular.next();
            }
            this.yearGanzhi = jiaziYear
            this.xingYear = xn;
            return this;
        },

        //排天盘(月将)
        _yuejiang: function () {
            if (this.yueJiangMethod == 1) {
                this.yueJiang = YUE_JIANG[this.lunar.getPrevQi()][0]; //月将
            } else {
                var yIdx = YUE_ZHI.indexOf(this.bazi.getYearZhi()) + 1;
                var mIdx = YUE_ZHI.indexOf(this.bazi.getMonthZhi()) + 1;
                var dIdx = YUE_ZHI.indexOf(this.bazi.getDayZhi()) + 1; //this.lunar.getDay();
                var hIdx = SHI_ZHI.indexOf(this.bazi.getTimeZhi()) + 1;
                var total = yIdx + mIdx + dIdx + hIdx;
                var mod = 0;
                if (total < 12) {
                    mod = 12 - total;
                } else {
                    mod = total % 12;
                    if (mod == 0) {
                        mod = 12;
                    }
                }
                this.yueJiang = YUE_JIANG2[mod - 1][0]; //月将
            }
            var yjIdx = _12YUEJIANG.indexOf(this.yueJiang);
            var yuejiangIter = CircularList(_12YUEJIANG, yjIdx);
            var idx = _12DIZHI.indexOf(this.zhanbuTimeCur);
            this.yueJiangList = {}; //月将盘列表，从地盘寅开始。
            for (var i = idx; i < 12; i++) {
                var dz = _12DIZHI[i];
                this.yueJiangList[dz] = yuejiangIter.next();
            }
            for (var i = 0; i < idx; i++) {
                var dz = _12DIZHI[i];
                this.yueJiangList[dz] = yuejiangIter.next();
            }

            return this;
        },
        //排人盘(贵人)
        _guiren: function () {

            var hour = _HOUR_ZHI[this.zhanbuTimeCur]; //this.solar.getHour();
            var isDaytime = this.guirenMethod === 1 ? hour >= 5/*卯*/ && hour < 17/*酉*/ : this.guirenMethod === 2 ? true : false;
            this.isDaytime = isDaytime;
            if (isDaytime) {
                this.guiren = tianyiguiren(this.bazi.getDayGan(), this.bazi.getDayZhi(), true);
            } else {
                this.guiren = tianyiguiren(this.bazi.getDayGan(), this.bazi.getDayZhi(), false);
            }

            for (var i = 0; i < 12; i++) {
                var dz = _12DIZHI[i];
                if (this.yueJiangList[dz] === this.guiren) {
                    var shenIdx = 0;
                    if (this.guirenSunni === 1) {//按地盘位置
                        this.guishenIter = CircularList(_12SHEN, shenIdx, "亥子丑寅卯辰".indexOf(dz) != -1 ? true : false);
                    } else {  //按男女
                        this.guishenIter = CircularList(_12SHEN, shenIdx, this.isMan);
                    }
                    this.guishenList = {};
                    for (var x = i; x < 12; x++) {
                        this.guishenList[_12DIZHI[x]] = this.guishenIter.next();
                    }
                    for (var x = 0; x < i; x++) {
                        this.guishenList[_12DIZHI[x]] = this.guishenIter.next();
                    }
                    break;
                }

            }
            return this;
        },
        //排天干
        _tiangan: function () {
            var gan = this.bazi.getDayGan();
            var zhi = this.bazi.getDayZhi();

            for (var i = 0; i < 12; i++) {
                var dz = _12DIZHI[i];
                if (this.yueJiangList[dz] === zhi) {
                    var ganIdx = _10TIANGAN.indexOf(gan);
                    var tianganIter;
                    if (this.guirenSunni === 1)
                        tianganIter = CircularList(_10TIANGAN, ganIdx);
                    else
                        tianganIter = CircularList(_10TIANGAN, ganIdx, this.isMan);//男顺女逆
                    this.tianganList = {};
                    for (var x = i; x < 12; x++) {
                        this.tianganList[_12DIZHI[x]] = tianganIter.next();
                    }
                    for (var x = 0; x < i; x++) {
                        this.tianganList[_12DIZHI[x]] = tianganIter.next();
                    }
                    break;
                }
            }

            return this;
        },
        //时运命起三传(阴盘六壬)
        _sym3chuan: function () {
            if( !this.yongShen ) {
                this.sym3chuanList = null;
                return this;
            }
            //计算时运命
            // 1、	定时：时即为天时，时支就为时。
            // 2、	定运：运即为运势，月将就为运。
            // 3、	定命：命即为人的宿命，被测者的属相就为命
            var sym = new Array(3); //时、运、命
            sym[0] = this.shiZhu[1];//时支
            sym[1] = this.yueJiang;//月将;
            sym[2] = this.yearGanzhi[1];//生肖对应地支

            //天干起三传
            var tgszstr = new Array(4);
            // tgszstr[0] = this.tianganList[this.shiZhu[0]];//时干
            tgszstr[0] = this.yongShen[0];//用神干
            tgszstr[1] =  this.yueJiangList[_10GAN_JIGONG[this.yongShen[0]]];
            tgszstr[2] = this.yueJiangList[tgszstr[1]];
            tgszstr[3] = this.yueJiangList[tgszstr[2]];
            //特例:如果出现月将和时支相同时，则地盘地支和月将处于同一位置，这种课式叫伏吟。伏吟课起三传时用刑，即月将所刑的地支。
            if (this.yueJiang === this.shiZhu[1]) {
                tgszstr[2] = xing(tgszstr[2]);
                tgszstr[3] = xing(tgszstr[2]);
            }
            //计算地支起三传
            var dzszstr = new Array(4);
            dzszstr[0] = this.yongShen[1];//用神支
            dzszstr[1] = this.yueJiangList[dzszstr[0]];
            dzszstr[2] = this.yueJiangList[dzszstr[1]];
            dzszstr[3] = this.yueJiangList[dzszstr[2]];
            //特例:如果出现月将和时支相同
            if (this.yueJiang === this.shiZhu[1]) {
                dzszstr[2] = xing(dzszstr[2]);
                dzszstr[3] = xing(dzszstr[2]);
            }
            this.sym3chuanList = {
                "gan3chuan": tgszstr,
                "zhi3chuan": dzszstr,
                "sym3chuan": sym,
            }
            
            return this;
        }
        ,
        //排四课
        _4ke: function () {
            this._4keList = [];
            //第一课
            this._4keList[0] = [];
            this._4keList[0].push(this.riZhu[0]); //日干
            for (let gan in _10GAN_JIGONG) {
                if (gan === this.riZhu[0]) {
                    var ji = _10GAN_JIGONG[gan];//寄宫
                    for (var i = 0; i < 12; i++) {
                        if (_12DIZHI[i] === ji) {
                            this._4keList[0].push(this.yueJiangList[_12DIZHI[i]]);//干阳
                            this._4keList[0].push(this.guishenList[_12DIZHI[i]]);
                            break;
                        }
                    }
                    break;
                }
            }

            //第二课
            this._4keList[1] = [];
            this._4keList[1].push(this._4keList[0][1]); //取自干阳
            var gy = this._4keList[0][1];//干阳
            for (var i = 0; i < 12; i++) {
                if (_12DIZHI[i] === gy) {
                    this._4keList[1].push(this.yueJiangList[_12DIZHI[i]]);//干阴
                    this._4keList[1].push(this.guishenList[_12DIZHI[i]]);
                    break;
                }
            }

            //第三课
            this._4keList[2] = [];
            this._4keList[2].push(this.riZhu[1]); //日支
            var rz = this.riZhu[1];//日支
            for (var i = 0; i < 12; i++) {
                if (_12DIZHI[i] === rz) {
                    this._4keList[2].push(this.yueJiangList[_12DIZHI[i]]);//支阳
                    this._4keList[2].push(this.guishenList[_12DIZHI[i]]);
                    break;
                }
            }

            //第四课
            this._4keList[3] = [];
            this._4keList[3].push(this._4keList[2][1]); //取自支阳
            var zy = this._4keList[2][1];
            for (var i = 0; i < 12; i++) {
                if (_12DIZHI[i] === zy) {
                    this._4keList[3].push(this.yueJiangList[_12DIZHI[i]]);//支阴
                    this._4keList[3].push(this.guishenList[_12DIZHI[i]]);
                    break;
                }
            }

            return this;
        },
        //排三传
        _3chuan: function () {
            var ganzhi = this.riZhu[0] + this.riZhu[1];
            var sanchuan = _720KE[ganzhi][this._4keList[0][1]].split("");
            this._3chuanList = [];

            this._3chuanList[0] = [];
            this._3chuanList[1] = [];
            this._3chuanList[2] = [];

            this._3chuanList[0].push(sanchuan[0]);
            for (var i = 0; i < 12; i++) {
                if (this.yueJiangList[_12DIZHI[i]] === sanchuan[0]) {
                    this._3chuanList[0].push(this.tianganList[_12DIZHI[i]]);
                    this._3chuanList[0].push(this.guishenList[_12DIZHI[i]]);
                    this._3chuanList[0].push(get6qinRelation(this.riZhu[0], sanchuan[0]));
                    break;
                }
            }

            this._3chuanList[1].push(sanchuan[1]);
            for (var i = 0; i < 12; i++) {
                if (this.yueJiangList[_12DIZHI[i]] === sanchuan[1]) {
                    this._3chuanList[1].push(this.tianganList[_12DIZHI[i]]);
                    this._3chuanList[1].push(this.guishenList[_12DIZHI[i]]);
                    this._3chuanList[1].push(get6qinRelation(this.riZhu[0], sanchuan[1]));
                    break;
                }
            }

            this._3chuanList[2].push(sanchuan[2]);
            for (var i = 0; i < 12; i++) {
                if (this.yueJiangList[_12DIZHI[i]] === sanchuan[2]) {
                    this._3chuanList[2].push(this.tianganList[_12DIZHI[i]]);
                    this._3chuanList[2].push(this.guishenList[_12DIZHI[i]]);
                    this._3chuanList[2].push(get6qinRelation(this.riZhu[0], sanchuan[2]));
                    break;
                }
            }

            return this;
        },

        //排12年煞
        _12niansha: function () {
            // 12地支顺序
            const zhiList = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

            // 12年煞顺序
            const yearShaList = [
                "太岁", "太阳", "丧门", "合神", "官符", "小耗",
                "大耗", "年墓", "白虎", "德神", "吊客", "病符"
            ];

            var yearZhi = this.bazi.getYearZhi();

            // 找到年支在12地支中的索引
            const startIndex = zhiList.indexOf(yearZhi);

            // 生成地支-年煞映射对象
            const result = {};
            for (let i = 0; i < 12; i++) {
                // 计算当前地支索引（循环12地支）
                const zhiIndex = (startIndex + i) % 12;
                // 对应的地支和年煞
                const zhi = zhiList[zhiIndex];
                const sha = yearShaList[i];
                result[zhi] = sha;
            }

            this._12nianshaList = result;
            return this;
        },

        //排命宫12宫
        _12gong: function () {
            var yearZhi = this.bazi.getYearZhi();
            var monthZhi = this.bazi.getMonthZhi();
            var dayGan = this.bazi.getDayGan();
            var hourZhi = this.bazi.getTimeZhi();
            var gender = this.isMan ? "男" : "女";

            const dizhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
            const palaces = ["命", "兄", "妻", "子", "财", "疾", "迁", "仆", "禄", "田", "德", "母"];
            const yinyangGan = {
                "甲": "阳", "乙": "阴", "丙": "阳", "丁": "阴", "戊": "阳",
                "己": "阴", "庚": "阳", "辛": "阴", "壬": "阳", "癸": "阴"
            };

            // 判断顺逆, 当前时间>=夏至 && 当前时间<冬至之间为阴，否则为阳
            var jieQiTable = this.lunar.getJieQiTable();
            var xiazhi = jieQiTable["夏至"];
            var dongzhi = jieQiTable["DONG_ZHI"];
            var isYang = !(this.solar.isAfter(xiazhi) && this.solar.isBefore(dongzhi))

            // 计算命宫位置
            var mingZhiIndex = dizhi.indexOf(this.yueJiang)+1 + dizhi.indexOf(hourZhi)+1 - 4;
            if (mingZhiIndex > 12) { mingZhiIndex = mingZhiIndex  - 12; }
            var mingZhi = dizhi[mingZhiIndex-1];

            // 从mingZhi开始按isYang顺或逆排十二宫
            const mingIdx = dizhi.indexOf(mingZhi);
            const result = {};
            if (isYang) {//顺排
                for (let i = 0; i < 12; i++) {
                    let idx = (mingIdx + i) % 12;
                    result[dizhi[idx]] = palaces[i];
                }
            }else{//逆排
                for (let i = 0; i < 12; i++) {
                    let idx = (mingIdx - i) % 12;
                    if (idx < 0) { idx = idx + 12; }
                    result[dizhi[idx]] = palaces[i];
                }
            }

            this._12gongList = result;
            return this;
        },

        paipan: function (params) {
            this._init(params["datetime"], params["realsun"], params["diqu"], params["isman"], params["yearMing"], params["yueJiangMethod"], params["guirenMethod"], params["guirenSunni"], params["zhanbuTime"], params["yongShen"]);
            this._yuejiang()._guiren()._tiangan()._sym3chuan()._4ke()._3chuan()._12niansha()._12gong();
            return {
                "params": params,
                "date": this.solar.getYear() + "年" + this.solar.getMonth() + "月" + this.solar.getDay() + "日" + " " + this.solar.getHour() + "时" + this.solar.getMinute() + "分" + "(" + this.lunar.getMonthInChinese() + "月" + this.lunar.getDayInChinese() + " " + this.shiZhu[1] + "时)",
                "siZhu": [this.nianZhu, this.yueZhu, this.riZhu, this.shiZhu],
                "zhanbuTime": this.zhanbuTimeCur,
                "solar": this.solar,
                "lunar": this.lunar,
                "jieqiInfo": {
                    "from": this.lunar.getPrevJieQi(false).getName(),
                    "fromDate": this.lunar.getPrevJieQi(false).getSolar().toYmdHms().slice(0, -3),
                    "to": this.lunar.getNextJieQi(false).getName(),
                    "toDate": this.lunar.getNextJieQi(false).getSolar().toYmdHms().slice(0, -3)
                },
                "data": {
                    "yueJiangList": this.yueJiangList,
                    "guishenList": this.guishenList,
                    "tianganList": this.tianganList,
                    "_4keList": this._4keList,
                    "_3chuanList": this._3chuanList,
                    "_12nianshaList": this._12nianshaList,
                    "_12gongList": this._12gongList,
                    "sym3chuanList": this.sym3chuanList,
                },
                "yuejiang": this.yueJiang,
                "isMan": this.isMan,
                "yearGanzhi": this.yearGanzhi,
                "xingYear": this.xingYear,
                "yongShen": this.yongShen,
                "kongwang": queryKongwang(this.riZhu.join("")),
                "isDaytime": this.isDaytime,
            }

        },

        //上一局
        prevPaipan: function () {
            var date = new Date(this.solar.getYear(), this.solar.getMonth() - 1, this.solar.getDay(), this.solar.getHour(), this.solar.getMinute(), 0);
            date.setHours(date.getHours() - 2);
            var aDate = date;
            var h = SHI_ZHI.indexOf(this.zhanbuTimeCur);
            if (h == 0) h = 11;
            else h = h - 1;
            return this.paipan(
                {
                    "datetime": aDate,
                    "realsun": false,
                    "diqu": this.diqu,
                    "isman": this.isMan,
                    "yearMing": this.yearMing,
                    "yueJiangMethod": this.yueJiangMethod,
                    "guirenMethod": this.guirenMethod,
                    "guirenSunni": this.guirenSunni,
                    "zhanbuTime": SHI_ZHI[h],
                }
            );

        },

        //下一局
        nextPaipan: function () {
            var date = new Date(this.solar.getYear(), this.solar.getMonth() - 1, this.solar.getDay(), this.solar.getHour(), this.solar.getMinute(), 0);
            date.setHours(date.getHours() + 2);
            var aDate = date;
            var h = SHI_ZHI.indexOf(this.zhanbuTimeCur);
            if (h == 11) h = 0;
            else h = h + 1;
            return this.paipan(
                {
                    "datetime": aDate,
                    "realsun": false,
                    "diqu": this.diqu,
                    "isman": this.isMan,
                    "yearMing": this.yearMing,
                    "yueJiangMethod": this.yueJiangMethod,
                    "guirenMethod": this.guirenMethod,
                    "guirenSunni": this.guirenSunni,
                    "zhanbuTime": SHI_ZHI[h],
                }
            );

        },



    }

    exports('da6ren', da6renObj);

})