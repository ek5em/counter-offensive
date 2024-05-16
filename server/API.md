# Документ с методами API

## Адрес домена
    http://counter-offensive/server/public//(значения порядку)
---  

## Структуры данных
**Успешный ответ**
```
Correct = {
    result:'ok',
    data: Data
}
```

**Ошибочный ответ**
```
Error = {
    result:'error',
    error: {
        code: number, 
        text: string
    }
}
```

**Пользователь**
```
User = {
    id:number
    login:string, 
    nickname:string,
    token:string,
    rank_name:string,
    gamer_exp:number,
    next_rang:number,
    level:number
}
```

**Сообщение**
```
message = {
    userId:number,
    nickname:string,
    text:string,
    level:number,
    rank_name:string,
    sendTime:string,
}
```

**Сообщения**
```
messages = {
    messages: [
        message
    ],
    chatHash: string
    }
```

**Лобби**
```
lobby = {
    general: bool,
    bannerman: bool,
    tanks: tanks,
    userInfo: userInfo

}
```

**Информация о пользователе**
```
userInfo = {
    rank_name: string,
    gamer_exp: number,
    next_rang: number
}
```

**Тяжелый танк**
```
heavyTank = {
    id: number,
    Gunner: bool,
    Mechanic: bool,
    Commander: bool
}
```

**Средний танк**
```
middleTank = {
    id: number,
    Gunner: bool,
    Mechanic: bool
}
```

**Танки**
```
tanks = {
    heavyTank: [
        heavyTank
    ],
    middleTank: [
        middleTank
    ]
}
```


**Состояние лобби**
```
lobbyState = {
    lobby: lobby,
    is_alive: bool,
    role: number,
    lobbyHash:string
}
```

**Игроки**
```
gamers = [
    gamer
]
```

**Игрок**
```
gamer = {
    person_id: number,
    x: number,
    y: number,
    angle: number
} 
```

**Моб**
```
mob = {
    person_id: number,
    x: number,
    y: number,
    angle: number
} 
```

**Танк**
```
panzer = {
    type: number,
    x: number,
    y: number,
    angle: number,
    tower_angle: number
} 
```

**Тело**
```
body = {
    bodytype: number,
    x: number,
    y: number,
    angle: number
    isMob: numebr
} 
```

**База**
```
mobBase = {
    x: number,
    y: number,
    radius: number
} 
```

**Карта**
```
map = {
    type: number,
    x: number,
    y: number,
    sizeX: number,
    sizeY: number, 
    angle: number
} 
```

**Пуля**
```
bullet = {
    type: number,
    x: number,
    y: number,
    dx: number,
    dy: number
} 
```
**Мобы**
```
mobs = [
    mob
]
```

**Танки**
```
panzers = [
    panzer
]
```

**Пули**
```
bullets = [
    bullet
]
```
**Тела**
```
bodies = [
    body
]
```
**Карта**
```
maps = [
    map
]
```



**Сцена**
```
scene = {
    is_dead:bool,
    is_end:bool,
    gamer: gamer || tank || null,
    gamers: gamers,
    tanks: panzers
    hashGamers: string,
    mobs: mobs,
    hashMobs: string,
    bullets: bullets,
    hashBullets: string,
    bodies: bodies,
    hashBodies: string,
    mobBase: mobBase,
    map: maps,
    hashMap: string
}
```

## Значение ошибок по их коду
400:**Bad Request** - Указаны не все обязательные параметры

*401*:**Unauthorized** - Неавторизованный запрос(неверный токен)

*403*:**Forbidden** - Неверный логин и пароль

*405*:**Method Not Allowed** - Метод не указан

*413*:**Invalid login(nickname)** - Неверный формат логина

*422*:**Invalid parameter values** - Невалидные значения параметров

*501*:**Not Implemented** - Метод не реализован на сервере
        
*503*:**DB Unavailable** - Не удалось подключиться к базе данных

*460*:**Login Occupied** - Логин занят

*432*:**Invalid Message** - Неправильные параметры сообщения

*461*:**User not Exist** - Пользователь не существует

*234*:**Insufficient level** - Недостаточный уровень

*235*:**Level less current gamer**- Уровень меньше текущего игрока

*236*:**You taken this role** - Данный игрок уже занял эту роль

*237*:**Role taken** - Роль уже занята

*238*:**Place already occupied** - Это место уже занято 

*239*:**Incorrect tank number** - Неверный номер танка 

*240*:**Tank number have another type** - Номер танка принадлежит другому типу

*463*:**Role not implemented** - Роль не реализована  

*9000*:**Unknown Error** - Неизвестная ошибка




---
## Метод регистрации
### Адрес
```method=registration```
### Параметры
|Параметр|Тип|Комментарий|
|-|-|-|
|login|string|длина от **6** до **15** символов, латиницы и кириллицы и спецсимволов "_-"|
|nickname|string|длина от **3** до **16** символов|
|hash|string|```sha256(login+password)```|

### Значение если успех
```
Correct=>User
```

### Значение если ошибка
```
Error(400) - Указаны не все обязательные параметры
Error(413) - Неверный формат логина
Error(460) - Логин занят
```


---
## Метод логина
### Адрес
```method=login```
### Параметры
|Параметр|Тип|Комментарий|
|-|-|-|
|login|string| |
|hash|string|```sha256(sha256(login+password)+rnd)```|
|rnd|number|рандомное число|
### Значение если успех
```
Correct=>User
```
### Значение если ошибка
```
Error(400) - Указаны не все обязательные параметры
Error(403) - Неверный логин или пароль
Error(461) - Пользователя не существует
```
---
## Метод выхода
### Адрес
```method=logout```
### Параметры
|Параметр|Тип|Комментарий|
|-|-|-|
|token|string|```sha256(uuid4)```|
### Значение если успех
```
Correct=>true
```
### Значение если ошибка
```
Error(400) - Указаны не все обязательные параметры
Error(401) - Неавторизованный запрос
```

---
## Метод подтверждения токена
### Адрес
```method=tokenVerification```
### Параметры
|Параметр|Тип|Комментарий|
|-|-|-|
|token|string|```sha256(uuid4)```|
### Значение если успех
```
Correct=>true
```
### Значение если ошибка
```
Error(400) - Указаны не все обязательные параметры
Error(401) - Неавторизованный запрос
```

---

## Метод обновления пароля
### Адрес
```method=updatePassword```
### Параметры
|Параметр|Тип|Комментарий|
|-|-|-|
|token|string|```sha256(uuid4)```|
|hash|string|```sha256(login+password)```|

### Значение если успех
```
Correct=>true
```
### Значение если ошибка
```
Error(400) - Указаны не все обязательные параметры
Error(401) - Неавторизованный запрос
```

## Метод отправки сообщения
### Адрес
```method=sendMessage```
### Параметры
|Параметр|Тип|Комментарий|
|-|-|-|
|token|string|```sha256(uuid4)```|
|message|string|```строка длиной от 1-го до 200 символов, содержащая символы кириллицы, латиницы и -+,.?!"'```|

### Значение если успех
```
Correct=>true
```
### Значение если ошибка
```
Error(400) - Указаны не все обязательные параметры
Error(432) - Неправильные параметры сообщения
Error(401) - Пользователя не существует
```

---

## Метод получения сообщений
### Адрес
```method=getMessages```
### Параметры
|Параметр|Тип|Комментарий|
|-|-|-|
|token|string|```sha256(uuid4)```|
|hash|string|```Хэш чата```|

### Значение если успех
```
Correct=>messages || true
```
### Значение если ошибка
```
Error(400) - Указаны не все обязательные параметры
Error(401) - Пользователя не существует
```

---

## Метод установки роли игрока
### Адрес
```method=setGamerRole```
### Параметры
|Параметр|Тип|Комментарий|
|-|-|-|
|token|string|```sha256(uuid4)```|
|role|number|```Роль которую хочет занять игрок```|
|tankId|number|```Номер танка который хочет занять игрок```|

### Значение если успех
```
Correct=>true
```
### Значение если ошибка
```
Error(400) - Указаны не все обязательные параметры
Error(401) - Пользователя не существует
Error(234) - Недостаточный уровень 
Error(235) - Уровень меньше текущего игрока
Error(236) - Данный игрок уже занял эту роль 
Error(237) - Роль уже занята
Error(238) - Это место уже занято
Error(239) - Неверный номер танка
Error(240) - Номер танка принадлежит другому типу
Error(463) - Роль не реализована
```

---

## Метод получения лобби
### Адрес
```method=getLobby```
### Параметры
|Параметр|Тип|Комментарий|
|-|-|-|
|token|string|```sha256(uuid4)```|
|hash|string|```Хэш лобби```|

### Значение если успех
```
Correct=>lobbyState || true
```
### Значение если ошибка
```
Error(400) - Указаны не все обязательные параметры
Error(401) - Пользователя не существует
```

## Метод смерти
### Адрес
```method=suicide```
### Параметры
|Параметр|Тип|Комментарий|
|-|-|-|
|token|string|```sha256(uuid4)```|

### Значение если успех
```
Correct=>true
```
### Значение если ошибка
```
Error(400) - Указаны не все обязательные параметры
Error(401) - Пользователя не существует
```

## Метод изменения координат игрока
### Адрес
```method=motion```
### Параметры
|Параметр|Тип|Комментарий|
|-|-|-|
|token|string|```sha256(uuid4)```|
|x|number||
|y|number||
|angle|number||

### Значение если успех
```
Correct=>true
```
### Значение если ошибка
```
Error(400) - Указаны не все обязательные параметры
Error(401) - Пользователя не существует
Error(422) - Неверный тип параметра
```

## Метод получения сцены
### Адрес
```method=getScene```
### Параметры
|Параметр|Тип|Комментарий|
|-|-|-|
|token|string|```sha256(uuid4)```|
|hashMap|string||
|hashGamers|string||
|hashMobs|string||
|hashBullets|string||
|hashBodies|string||

### Значение если успех
```
Correct=>scene
```
### Значение если ошибка
```
Error(400) - Указаны не все обязательные параметры
Error(401) - Пользователя не существует
```

## Метод выстрела
### Адрес
```method=fire```
### Параметры
|Параметр|Тип|Комментарий|
|-|-|-|
|token|string|```sha256(uuid4)```|
|x|string||
|y|string||
|angle|string||

### Значение если успех
```
Correct=>true
```
### Значение если ошибка
```
Error(400) - Указаны не все обязательные параметры
Error(401) - Пользователя не существует
```