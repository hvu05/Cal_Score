import { useState, useEffect } from "react"
import { Select, Input, Button, Checkbox, Popconfirm } from 'antd';

import './Page.css'
function Page() {
    const [score, setScore] = useState(0)
    const [show, setShow] = useState(false)

    const [subject, setSubject] = useState(() => {
        const saved = localStorage.getItem("subjects")
        return saved ? JSON.parse(saved) : []
    });

    useEffect(() => {
        localStorage.setItem("subjects", JSON.stringify(subject));
    }, [subject]);

    const addSubject = (is_subject) => {
        if (is_subject) setSubject([...subject, { id: Date.now(), name: "", score: 0, credit: 0, is_subject: true }])
        else setSubject([...subject, { id: Date.now(), name: "", score: 0, credit: 0, is_subject: false }])
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
        subject.map((sub) => {
            if (sub.is_subject === true) {
                sumScore = sumScore + (+sub.credit) * (+sub.score)
                sumCredit = sumCredit + (+sub.credit)
            }
        })
        var GPA = sumScore / sumCredit
        setScore(GPA)
        setShow(true)
    }
    const HandleDelete = (i) => {
        const newData = subject.filter((sub) => sub.id !== i)
        setSubject(newData)
    }
    const HandleAddSubjectBySemester = (idSem) => {
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
                    score: 0,
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
        { value: 1, label: 'E (1.00)' },
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
                <Button type="primary" onClick={showValue} className="calScore">Tính điểm</Button>
                <Button type="default" onClick={() => addSubject(false)} className="calScore">Tạo học kì</Button>
            </div>
            {subject.map((sub, index) => (
                (sub.is_subject) ? (
                    <div key={sub.id} className="subject">
                        <label style={{ marginRight: '8px', marginLeft: '40px' }}>Tên môn học:</label>
                        <Input placeholder="Tên môn học" className="subjectName" value={sub.name} onChange={(e) => updateName(index, e.target.value)} />

                        <span className="score">
                            <Select
                                value={sub.score}
                                style={{ width: 100 }}
                                showSearch
                                placeholder="A (4.00)"
                                optionFilterProp="label"
                                onChange={(e) => updateScore(index, e)}
                                options={scoreOptions}
                            />
                        </span>

                        <Select
                            value={sub.credit}
                            className="credit"
                            style={{ width: 100 }}
                            showSearch
                            placeholder="4 tín chỉ"
                            optionFilterProp="label"
                            onChange={(e) => updateCredit(index, e)}
                            options={creditOptions}
                        />

                        <Button color="danger" variant="dashed" className="delete" onClick={() => HandleDelete(sub.id)}>Xóa</Button>
                        <Checkbox>Đánh dấu</Checkbox>
                    </div>
                ) : (
                    <div key={sub.id} className="TaoHocKi">
                        <label style={{ marginRight: '8px', marginLeft: '20px' }}>Học kì:</label>
                        <Input placeholder="Học kì" className="subjectName" value={sub.name} onChange={(e) => updateName(index, e.target.value)} />
                        <Button style={{ marginRight: '10px' }} color="primary" variant="dashed" className="deleteHK" onClick={() => HandleAddSubjectBySemester(sub.id)}>+</Button>
                        <Popconfirm
                            title="Bạn có chắc muốn xóa tất cả các môn học trong học kì này không?"
                            onConfirm={() => HandleDeleteSemester(sub.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <Button color="danger" variant="solid" className="deleteHK">Xóa</Button>
                        </Popconfirm>
                    </div>
                )
            ))}
            <div>===================================================================</div>
            <span className="GPA">GPA: {show && ` ${score}`}</span>
        </>
    )
}
export default Page