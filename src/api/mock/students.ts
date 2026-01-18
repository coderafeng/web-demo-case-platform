import type { Student } from '../types'
import {mockScores, deleteScoresByStudent} from "./score.ts";


export const mockStudents: Student[] = [
    {
        "id": 1,
        "name": "韩信",
        "age": 16,
        "classId": 1,
        "gender": "male"
    },
    {
        "id": 2,
        "name": "李白",
        "age": 17,
        "classId": 1,
        "gender": "male"
    },
    {
        "id": 3,
        "name": "貂蝉",
        "age": 16,
        "classId": 1,
        "gender": "female"
    },
    {
        "id": 4,
        "name": "诸葛亮",
        "age": 18,
        "classId": 1,
        "gender": "male"
    },
    {
        "id": 5,
        "name": "孙尚香",
        "age": 16,
        "classId": 1,
        "gender": "female"
    },
    {
        "id": 6,
        "name": "赵云",
        "age": 17,
        "classId": 2,
        "gender": "male"
    },
    {
        "id": 7,
        "name": "王昭君",
        "age": 16,
        "classId": 2,
        "gender": "female"
    },
    {
        "id": 8,
        "name": "关羽",
        "age": 18,
        "classId": 2,
        "gender": "male"
    },
    {
        "id": 9,
        "name": "小乔",
        "age": 15,
        "classId": 2,
        "gender": "female"
    },
    {
        "id": 10,
        "name": "孙悟空",
        "age": 17,
        "classId": 3,
        "gender": "male"
    },
    {
        "id": 11,
        "name": "露娜",
        "age": 16,
        "classId": 3,
        "gender": "female"
    },
    {
        "id": 12,
        "name": "吕布",
        "age": 18,
        "classId": 3,
        "gender": "male"
    },
    {
        "id": 13,
        "name": "大乔",
        "age": 16,
        "classId": 3,
        "gender": "female"
    },
    {
        "id": 14,
        "name": "狄仁杰",
        "age": 17,
        "classId": 3,
        "gender": "male"
    },
    {
        "id": 15,
        "name": "典韦",
        "age": 18,
        "classId": 3,
        "gender": "male"
    },
    {
        "id": 16,
        "name": "亚瑟",
        "age": 17,
        "classId": 4,
        "gender": "male"
    },
    {
        "id": 17,
        "name": "安琪拉",
        "age": 16,
        "classId": 4,
        "gender": "female"
    },
    {
        "id": 18,
        "name": "鲁班七号",
        "age": 15,
        "classId": 4,
        "gender": "male"
    },
    {
        "id": 19,
        "name": "程咬金",
        "age": 18,
        "classId": 5,
        "gender": "male"
    },
    {
        "id": 20,
        "name": "妲己",
        "age": 16,
        "classId": 5,
        "gender": "female"
    },
    {
        "id": 21,
        "name": "钟无艳",
        "age": 17,
        "classId": 5,
        "gender": "female"
    },
    {
        "id": 22,
        "name": "花木兰",
        "age": 17,
        "classId": 5,
        "gender": "female"
    },
    {
        "id": 23,
        "name": "周瑜",
        "age": 18,
        "classId": 5,
        "gender": "male"
    },
    {
        "id": 24,
        "name": "项羽",
        "age": 18,
        "classId": 5,
        "gender": "male"
    },
    {
        "id": 25,
        "name": "虞姬",
        "age": 16,
        "classId": 5,
        "gender": "female"
    },
    {
        "id": 26,
        "name": "兰陵王",
        "age": 17,
        "classId": 6,
        "gender": "male"
    },
    {
        "id": 27,
        "name": "嬴政",
        "age": 18,
        "classId": 6,
        "gender": "male"
    },
    {
        "id": 28,
        "name": "芈月",
        "age": 17,
        "classId": 6,
        "gender": "female"
    },
    {
        "id": 29,
        "name": "达摩",
        "age": 18,
        "classId": 6,
        "gender": "male"
    },
    {
        "id": 30,
        "name": "狄仁杰",
        "age": 17,
        "classId": 6,
        "gender": "male"
    },
    {
        "id": 31,
        "name": "娜可露露",
        "age": 16,
        "classId": 7,
        "gender": "female"
    },
    {
        "id": 32,
        "name": "橘右京",
        "age": 17,
        "classId": 7,
        "gender": "male"
    },
    {
        "id": 33,
        "name": "不知火舞",
        "age": 17,
        "classId": 7,
        "gender": "female"
    },
    {
        "id": 34,
        "name": "宫本武藏",
        "age": 18,
        "classId": 7,
        "gender": "male"
    },
    {
        "id": 35,
        "name": "夏侯惇",
        "age": 18,
        "classId": 8,
        "gender": "male"
    },
    {
        "id": 36,
        "name": "甄姬",
        "age": 16,
        "classId": 8,
        "gender": "female"
    },
    {
        "id": 37,
        "name": "蔡文姬",
        "age": 15,
        "classId": 8,
        "gender": "female"
    },
    {
        "id": 38,
        "name": "老夫子",
        "age": 18,
        "classId": 8,
        "gender": "male"
    },
    {
        "id": 39,
        "name": "扁鹊",
        "age": 17,
        "classId": 8,
        "gender": "male"
    },
    {
        "id": 40,
        "name": "白起",
        "age": 18,
        "classId": 8,
        "gender": "male"
    },
    {
        "id": 41,
        "name": "庄周",
        "age": 17,
        "classId": 9,
        "gender": "male"
    },
    {
        "id": 42,
        "name": "刘禅",
        "age": 16,
        "classId": 9,
        "gender": "male"
    },
    {
        "id": 43,
        "name": "高渐离",
        "age": 17,
        "classId": 10,
        "gender": "male"
    },
    {
        "id": 44,
        "name": "荆轲",
        "age": 18,
        "classId": 10,
        "gender": "female"
    },
    {
        "id": 45,
        "name": "钟馗",
        "age": 18,
        "classId": 10,
        "gender": "male"
    },
    {
        "id": 46,
        "name": "杨玉环",
        "age": 16,
        "classId": 10,
        "gender": "female"
    },
    {
        "id": 47,
        "name": "裴擒虎",
        "age": 17,
        "classId": 10,
        "gender": "male"
    },
    {
        "id": 48,
        "name": "公孙离",
        "age": 16,
        "classId": 10,
        "gender": "female"
    },
    {
        "id": 49,
        "name": "明世隐",
        "age": 17,
        "classId": 10,
        "gender": "male"
    },
    {
        "id": 50,
        "name": "弈星",
        "age": 15,
        "classId": 10,
        "gender": "male"
    },
    {
        "id": 51,
        "name": "梦奇",
        "age": 15,
        "classId": 11,
        "gender": "male"
    },
    {
        "id": 52,
        "name": "百里守约",
        "age": 17,
        "classId": 11,
        "gender": "male"
    },
    {
        "id": 53,
        "name": "百里玄策",
        "age": 16,
        "classId": 11,
        "gender": "male"
    },
    {
        "id": 54,
        "name": "苏烈",
        "age": 18,
        "classId": 11,
        "gender": "male"
    },
    {
        "id": 55,
        "name": "铠",
        "age": 17,
        "classId": 11,
        "gender": "male"
    },
    {
        "id": 56,
        "name": "盾山",
        "age": 18,
        "classId": 12,
        "gender": "male"
    },
    {
        "id": 57,
        "name": "孙策",
        "age": 17,
        "classId": 12,
        "gender": "male"
    },
    {
        "id": 58,
        "name": "米莱狄",
        "age": 16,
        "classId": 12,
        "gender": "female"
    },
    {
        "id": 59,
        "name": "狂铁",
        "age": 18,
        "classId": 12,
        "gender": "male"
    },
    {
        "id": 60,
        "name": "瑶",
        "age": 15,
        "classId": 13,
        "gender": "female"
    },
    {
        "id": 61,
        "name": "云中君",
        "age": 17,
        "classId": 13,
        "gender": "male"
    },
    {
        "id": 62,
        "name": "曜",
        "age": 16,
        "classId": 13,
        "gender": "male"
    },
    {
        "id": 63,
        "name": "西施",
        "age": 16,
        "classId": 13,
        "gender": "female"
    },
    {
        "id": 64,
        "name": "马超",
        "age": 17,
        "classId": 13,
        "gender": "male"
    },
    {
        "id": 65,
        "name": "蒙犽",
        "age": 16,
        "classId": 13,
        "gender": "male"
    },
    {
        "id": 66,
        "name": "鲁班大师",
        "age": 18,
        "classId": 13,
        "gender": "male"
    },
    {
        "id": 67,
        "name": "镜",
        "age": 17,
        "classId": 14,
        "gender": "female"
    },
    {
        "id": 68,
        "name": "蒙恬",
        "age": 18,
        "classId": 14,
        "gender": "male"
    },
    {
        "id": 69,
        "name": "阿古朵",
        "age": 15,
        "classId": 14,
        "gender": "female"
    },
    {
        "id": 70,
        "name": "司空震",
        "age": 18,
        "classId": 15,
        "gender": "male"
    },
    {
        "id": 71,
        "name": "艾琳",
        "age": 16,
        "classId": 15,
        "gender": "female"
    },
    {
        "id": 72,
        "name": "云缨",
        "age": 17,
        "classId": 15,
        "gender": "female"
    },
    {
        "id": 73,
        "name": "金蝉",
        "age": 17,
        "classId": 15,
        "gender": "male"
    },
    {
        "id": 74,
        "name": "暃",
        "age": 17,
        "classId": 15,
        "gender": "male"
    },
    {
        "id": 75,
        "name": "桑启",
        "age": 15,
        "classId": 16,
        "gender": "male"
    },
    {
        "id": 76,
        "name": "戈娅",
        "age": 16,
        "classId": 16,
        "gender": "female"
    },
    {
        "id": 77,
        "name": "海月",
        "age": 17,
        "classId": 16,
        "gender": "female"
    },
    {
        "id": 78,
        "name": "赵怀真",
        "age": 17,
        "classId": 16,
        "gender": "male"
    },
    {
        "id": 79,
        "name": "莱西奥",
        "age": 18,
        "classId": 16,
        "gender": "male"
    },
    {
        "id": 80,
        "name": "姬小满",
        "age": 16,
        "classId": 16,
        "gender": "female"
    },
    {
        "id": 81,
        "name": "亚连",
        "age": 17,
        "classId": 17,
        "gender": "male"
    },
    {
        "id": 82,
        "name": "上官婉儿",
        "age": 17,
        "classId": 17,
        "gender": "female"
    },
    {
        "id": 83,
        "name": "沈梦溪",
        "age": 16,
        "classId": 17,
        "gender": "male"
    },
    {
        "id": 84,
        "name": "李信",
        "age": 18,
        "classId": 17,
        "gender": "male"
    },
    {
        "id": 85,
        "name": "伽罗",
        "age": 16,
        "classId": 18,
        "gender": "female"
    },
    {
        "id": 86,
        "name": "猪八戒",
        "age": 18,
        "classId": 18,
        "gender": "male"
    },
    {
        "id": 87,
        "name": "嫦娥",
        "age": 16,
        "classId": 18,
        "gender": "female"
    },
    {
        "id": 88,
        "name": "马可波罗",
        "age": 17,
        "classId": 18,
        "gender": "male"
    },
    {
        "id": 89,
        "name": "成吉思汗",
        "age": 18,
        "classId": 18,
        "gender": "male"
    },
    {
        "id": 90,
        "name": "太乙真人",
        "age": 18,
        "classId": 19,
        "gender": "male"
    },
    {
        "id": 91,
        "name": "东皇太一",
        "age": 18,
        "classId": 19,
        "gender": "male"
    },
    {
        "id": 92,
        "name": "干将莫邪",
        "age": 18,
        "classId": 20,
        "gender": "male"
    },
    {
        "id": 93,
        "name": "鬼谷子",
        "age": 17,
        "classId": 20,
        "gender": "male"
    },
    {
        "id": 94,
        "name": "雅典娜",
        "age": 17,
        "classId": 20,
        "gender": "female"
    },
    {
        "id": 95,
        "name": "张良",
        "age": 18,
        "classId": 20,
        "gender": "male"
    },
    {
        "id": 96,
        "name": "后羿",
        "age": 17,
        "classId": 20,
        "gender": "male"
    },
    {
        "id": 97,
        "name": "刘邦",
        "age": 18,
        "classId": 20,
        "gender": "male"
    },
    {
        "id": 98,
        "name": "武则天",
        "age": 18,
        "classId": 20,
        "gender": "female"
    },
    {
        "id": 99,
        "name": "廉颇",
        "age": 18,
        "classId": 20,
        "gender": "male"
    },
    {
        "id": 100,
        "name": "墨子",
        "age": 18,
        "classId": 21,
        "gender": "male"
    },
    {
        "id": 101,
        "name": "黄忠",
        "age": 18,
        "classId": 21,
        "gender": "male"
    },
    {
        "id": 102,
        "name": "张飞",
        "age": 18,
        "classId": 21,
        "gender": "male"
    },
    {
        "id": 103,
        "name": "刘备",
        "age": 18,
        "classId": 22,
        "gender": "male"
    },
    {
        "id": 104,
        "name": "孙膑",
        "age": 15,
        "classId": 22,
        "gender": "male"
    },
    {
        "id": 105,
        "name": "姜子牙",
        "age": 18,
        "classId": 22,
        "gender": "male"
    },
    {
        "id": 106,
        "name": "娜可露露",
        "age": 16,
        "classId": 22,
        "gender": "female"
    },
    {
        "id": 107,
        "name": "橘右京",
        "age": 17,
        "classId": 22,
        "gender": "male"
    },
    {
        "id": 108,
        "name": "不知火舞",
        "age": 17,
        "classId": 22,
        "gender": "female"
    },
    {
        "id": 109,
        "name": "宫本武藏",
        "age": 18,
        "classId": 22,
        "gender": "male"
    },
    {
        "id": 110,
        "name": "夏侯惇",
        "age": 18,
        "classId": 23,
        "gender": "male"
    },
    {
        "id": 111,
        "name": "甄姬",
        "age": 16,
        "classId": 23,
        "gender": "female"
    },
    {
        "id": 112,
        "name": "蔡文姬",
        "age": 15,
        "classId": 23,
        "gender": "female"
    },
    {
        "id": 113,
        "name": "老夫子",
        "age": 18,
        "classId": 23,
        "gender": "male"
    },
    {
        "id": 114,
        "name": "扁鹊",
        "age": 17,
        "classId": 23,
        "gender": "male"
    },
    {
        "id": 115,
        "name": "白起",
        "age": 18,
        "classId": 24,
        "gender": "male"
    },
    {
        "id": 116,
        "name": "庄周",
        "age": 17,
        "classId": 24,
        "gender": "male"
    },
    {
        "id": 117,
        "name": "刘禅",
        "age": 16,
        "classId": 24,
        "gender": "male"
    },
    {
        "id": 118,
        "name": "高渐离",
        "age": 17,
        "classId": 24,
        "gender": "male"
    },
    {
        "id": 119,
        "name": "荆轲",
        "age": 18,
        "classId": 25,
        "gender": "female"
    },
    {
        "id": 120,
        "name": "钟馗",
        "age": 18,
        "classId": 25,
        "gender": "male"
    },
    {
        "id": 121,
        "name": "杨玉环",
        "age": 16,
        "classId": 25,
        "gender": "female"
    },
    {
        "id": 122,
        "name": "裴擒虎",
        "age": 17,
        "classId": 25,
        "gender": "male"
    },
    {
        "id": 123,
        "name": "公孙离",
        "age": 16,
        "classId": 25,
        "gender": "female"
    },
    {
        "id": 124,
        "name": "明世隐",
        "age": 17,
        "classId": 25,
        "gender": "male"
    },
    {
        "id": 125,
        "name": "弈星",
        "age": 15,
        "classId": 26,
        "gender": "male"
    },
    {
        "id": 126,
        "name": "梦奇",
        "age": 15,
        "classId": 26,
        "gender": "male"
    },
    {
        "id": 127,
        "name": "百里守约",
        "age": 17,
        "classId": 26,
        "gender": "male"
    },
    {
        "id": 128,
        "name": "百里玄策",
        "age": 16,
        "classId": 27,
        "gender": "male"
    },
    {
        "id": 129,
        "name": "苏烈",
        "age": 18,
        "classId": 27,
        "gender": "male"
    },
    {
        "id": 130,
        "name": "铠",
        "age": 17,
        "classId": 27,
        "gender": "male"
    },
    {
        "id": 131,
        "name": "盾山",
        "age": 18,
        "classId": 27,
        "gender": "male"
    },
    {
        "id": 132,
        "name": "孙策",
        "age": 17,
        "classId": 27,
        "gender": "male"
    },
    {
        "id": 133,
        "name": "米莱狄",
        "age": 16,
        "classId": 27,
        "gender": "female"
    },
    {
        "id": 134,
        "name": "狂铁",
        "age": 18,
        "classId": 27,
        "gender": "male"
    },
    {
        "id": 135,
        "name": "瑶",
        "age": 15,
        "classId": 28,
        "gender": "female"
    },
    {
        "id": 136,
        "name": "云中君",
        "age": 17,
        "classId": 28,
        "gender": "male"
    },
    {
        "id": 137,
        "name": "曜",
        "age": 16,
        "classId": 28,
        "gender": "male"
    },
    {
        "id": 138,
        "name": "西施",
        "age": 16,
        "classId": 28,
        "gender": "female"
    },
    {
        "id": 139,
        "name": "马超",
        "age": 17,
        "classId": 28,
        "gender": "male"
    },
    {
        "id": 140,
        "name": "蒙犽",
        "age": 16,
        "classId": 29,
        "gender": "male"
    },
    {
        "id": 141,
        "name": "鲁班大师",
        "age": 18,
        "classId": 29,
        "gender": "male"
    },
    {
        "id": 142,
        "name": "镜",
        "age": 17,
        "classId": 29,
        "gender": "female"
    },
    {
        "id": 143,
        "name": "蒙恬",
        "age": 18,
        "classId": 29,
        "gender": "male"
    },
    {
        "id": 144,
        "name": "阿古朵",
        "age": 15,
        "classId": 30,
        "gender": "female"
    },
    {
        "id": 145,
        "name": "司空震",
        "age": 18,
        "classId": 30,
        "gender": "male"
    },
    {
        "id": 146,
        "name": "艾琳",
        "age": 16,
        "classId": 30,
        "gender": "female"
    },
    {
        "id": 147,
        "name": "云缨",
        "age": 17,
        "classId": 30,
        "gender": "female"
    },
    {
        "id": 148,
        "name": "金蝉",
        "age": 17,
        "classId": 30,
        "gender": "male"
    },
    {
        "id": 149,
        "name": "暃",
        "age": 17,
        "classId": 30,
        "gender": "male"
    },
    {
        "id": 150,
        "name": "桑启",
        "age": 15,
        "classId": 30,
        "gender": "male"
    }
]

// 获取带成绩分数的学生
export const getStudentWithScores = (id: number) => {
    const student = mockStudents.find(stu => stu.id === id)
    if (!student) return undefined

    const scores = mockScores.filter(sco => sco.studentId === id)
    return {
        ...student,
        scores
    }
}

export const findStudentById = (id: number): Student | undefined => {
    return mockStudents.find(stu => stu.id === id)
}

export const findStudentsByClass = (classId: number): Student[] => {
    return mockStudents.filter(stu => stu.classId === classId)
}

export const searchStudents = (name: string, minAge: number, maxAge: number, gender: string): Student[] => {
    return mockStudents.filter(stu => {
        if (name != null && name != '' && !stu.name.toLowerCase().includes(name.toLowerCase())) {
            return false;
        }
        if (stu.age < minAge) return false;
        if (stu.age > maxAge) return false;
        if (gender != null && gender != '' && stu.gender !== gender) return false;
        return true;
    });
}

export const deleteStudentsByClass = (classId: number): Student[] => {
    deleteScoresByStudent(mockStudents.filter(stu => stu.id === classId).map(st => st.id));
    return mockStudents.filter(stu => stu.id !== classId);
}
