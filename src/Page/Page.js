import { useState, useEffect } from "react"
import { Select, Input, Button, Checkbox } from 'antd';
import './Page.css'
function Page() {
    const [score, setScore] = useState(0)
    const [show, setShow] = useState(false)
    // const [subject, setSubject] = useState([])
    const [subject, setSubject] = useState(() => {
        const saved = localStorage.getItem("subjects");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("subjects", JSON.stringify(subject));
    }, [subject]);

    const addSubject = (is_sub) => {
        if (is_sub) setSubject([...subject, { id: Date.now(), name: "", score: 0, credit: 0 }])
        else setSubject([...subject, { id: Date.now(), name: "", score: -1, credit: -1 }])
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
        updated[index] = {...updated[index], name: newName}
        setSubject(updated)
    }
    const showValue = () => {
        var sumScore = 0
        var sumCredit = 0
        subject.map((sub) => {
            if (sub.score !== -1) {
                sumScore = sumScore + (+sub.credit) * (+sub.score)
                sumCredit = sumCredit + (+sub.credit)
            }
        })
        var GPA = sumScore / sumCredit

        // setChenhLech(score - GPA)
        setScore(GPA)
        setShow(true)
    }
    const HandleDelete = (i) => {
        const newData = subject.filter((sub) => sub.id !== i)
        setSubject(newData)
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
            <Button type="primary" onClick={() => addSubject(true)} className="buttonAdd">Thêm môn học</Button>
            <Button type="default" onClick={showValue} className="calScore">Tính điểm</Button>
            <Button type="default" onClick={() => addSubject(false)} className="calScore">Tạo học kì</Button>

            {subject.map((sub, index) => (
                (sub.score !== -1) ? (
                    <div key={sub.id} className="subject">
                        <label style={{ marginRight: '8px' }}>Tên môn:</label>
                        <Input placeholder="Tên môn học" className="subjectName" value={sub.name} onChange={(e) => updateName(index, e.target.value)}/>

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

                        <Button color="danger" variant="solid" className="delete" onClick={() => HandleDelete(sub.id)}>Delete</Button>
                        <Checkbox>Note</Checkbox>
                    </div>
                ) : (
                    <div key={sub.id} className="TaoHocKi">
                        <Input className="HocKi" placeholder="Học kì"/>
                        <Button color="danger" variant="solid" className="deleteHK" onClick={() => HandleDelete(sub.id)}>Delete</Button>
                    </div>
                )
            ))}
            {show && `GPA: ${score}`}
        </>
    )
}
export default Page