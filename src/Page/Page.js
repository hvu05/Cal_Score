import { useState, useEffect } from "react"
import { Select, Input, Button, Checkbox, Popconfirm } from 'antd';

import './PageByMe.scss'
function Page() {
    const [score, setScore] = useState({Score: 0, Credit: 0})
    const [show, setShow] = useState(false)

    const [subject, setSubject] = useState(() => {
        const saved = localStorage.getItem("subjects")
        return saved ? JSON.parse(saved) : []
    });

    useEffect(() => {
        localStorage.setItem("subjects", JSON.stringify(subject));
    }, [subject]);

    const addSemester = () => {
        setSubject([...subject, { id: Date.now(), name: "", score: 0, credit: 0, is_subject: false }])
    }

    const updateScore = (index, newScore) => {
        const updated = [...subject]
        updated[index] = { ...updated[index], score: newScore }
        setSubject(updated)
    }
    const updateCredit = (index, newCredit) => {
        const updated = [...subject]
        updated[index] = { ...updated[index], credit: newCredit }
        setSubject(updated)
    }
    const updateName = (index, newName) => {
        const updated = [...subject]
        updated[index] = { ...updated[index], name: newName }
        setSubject(updated)
    }
    const showValue = () => {
        var sumScore = 0
        var sumCredit = 0
        console.log(subject)
        subject.map((sub) => {
            console.log("Hello")
            if (sub.is_subject === true && sub.score !== -1) {
                sumScore = sumScore + (+sub.credit) * (+sub.score)
                sumCredit = sumCredit + (+sub.credit)
            }
        })
        var GPA = sumScore / sumCredit
        console.log(score)
        setScore({Score: GPA, Credit: sumCredit})
        console.log(score)
        setShow(true)
    }
    const HandleDelete = (i) => {
        const newData = subject.filter((sub) => sub.id !== i)
        setSubject(newData)
    }
    const HandleaddSubjectBySemester = (idSem) => {
        const updated = [];
        let inserted = false;

        for (let i = 0; i < subject.length; ++i) {
            const item = subject[i];
            updated.push(item);

            if (item.id === idSem) {
                let j = i + 1;
                while (j < subject.length && subject[j].is_subject === true) {
                    updated.push(subject[j]);
                    ++j;
                    i = j - 1;
                }

                updated.push({
                    id: Date.now(),
                    name: "",
                    score: -1,
                    credit: 0,
                    is_subject: true,
                });

                inserted = true;
            }
        }
        if (!inserted) {
            console.warn("Không tìm thấy học kỳ để thêm môn.");
        }

        setSubject(updated);
    }
    const HandleDeleteSemester = (id) => {
        const updated = []
        let i = 0
        while (i < subject.length) {
            const item = subject[i]
            if (item.id === id) {
                i++
                while (i < subject.length && subject[i].is_subject === true) {
                    i++
                }
            }
            else {
                updated.push(item)
                i++
            }
        }
        setSubject(updated)
    }

    const scoreOptions = [
        { value: 4, label: 'A (4.00)' },
        { value: 3.5, label: 'B+ (3.5)' },
        { value: 3, label: 'B (3.00)' },
        { value: 2.5, label: 'C+ (2.5)' },
        { value: 2, label: 'C (2.00)' },
        { value: 1.5, label: 'D+ (1.5)' },
        { value: 1, label: 'D (1.00)' },
        { value: 0, label: 'F (0.00)'},
        { value: -1, label: 'Chưa tính'}
    ]
    const creditOptions = [
        { value: 5, label: '5 tín chỉ' },
        { value: 4, label: '4 tín chỉ' },
        { value: 3, label: '3 tín chỉ' },
        { value: 2, label: '2 tín chỉ' },
        { value: 1, label: '1 tín chỉ' },
    ]

    return (
        <>
            <div className="menu">
                <Button type="primary" onClick={showValue} className="menu__calScore">Tính điểm</Button>
                <Button type="default" onClick={addSemester} className="menu__calScore">Tạo học kì</Button>
            </div>
            {subject.map((sub, index) => (
                (sub.is_subject) ? (
                    <div key={sub.id} className="subject">
                        <label >Tên môn học:</label>
                        <Input placeholder="Tên môn học" className="subject__name" value={sub.name} onChange={(e) => updateName(index, e.target.value)} />

                        <span className="subject__score">
                            <Select
                                value={sub.score}
                                style={{ width: 104 }}
                                showSearch
                                placeholder="A (4.00)"
                                optionFilterProp="label"
                                onChange={(e) => updateScore(index, e)}
                                options={scoreOptions}
                            />
                        </span>

                        <Select
                            value={sub.credit}
                            className="subject__credit"
                            style={{ width: 100 }}
                            showSearch
                            placeholder="4 tín chỉ"
                            optionFilterProp="label"
                            onChange={(e) => updateCredit(index, e)}
                            options={creditOptions}
                        />

                        <Button color="danger" variant="dashed" className="subject__delete" onClick={() => HandleDelete(sub.id)}>Xóa</Button>
                        <Checkbox>Đánh dấu</Checkbox>
                    </div>
                ) : (
                    <div key={sub.id} className="sem">
                        <label>Học kì:</label>
                        <Input placeholder="Học kì" className="sem__name" value={sub.name} onChange={(e) => updateName(index, e.target.value)} />
                        <Button color="primary" variant="dashed" className="sem__add" onClick={() => HandleaddSubjectBySemester(sub.id)}>+</Button>
                        <Popconfirm
                            title="Bạn có chắc muốn xóa tất cả các môn học trong học kì này không?"
                            onConfirm={() => HandleDeleteSemester(sub.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <Button color="danger" variant="solid" className="sem__delete">Xóa</Button>
                        </Popconfirm>
                    </div>
                )
            ))}
            {/* <div>===================================================================</div> */}
            <div className="GPA">GPA: {show && ` ${score.Score}`}</div>
            <div className="CRE">Số tín chỉ tích lũy: {show && ` ${score.Credit}`}</div>
        </>
    )
}
export default Page