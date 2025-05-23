import React, { useMemo } from "react";
import "./DatePicker.css";

const WEEK_DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];

function getMonthDays(year, month) {
    const days = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

function getRange(from, to) {
    if (!from || !to) return [];
    const range = [];
    let d = new Date(from);
    while (d <= to) {
        range.push(new Date(d));
        d.setDate(d.getDate() + 1);
    }
    return range;
}

function addMonth(year, month, offset) {
    let newMonth = month + offset;
    let newYear = year;
    while (newMonth < 0) {
        newMonth += 12;
        newYear -= 1;
    }
    while (newMonth > 11) {
        newMonth -= 12;
        newYear += 1;
    }
    return [newYear, newMonth];
}

const MonthCalendar = ({
    year,
    month,
    disabledSet,
    from,
    to,
    rangeSet,
    handleDayClick,
    showNav,
    onPrevMonth,
    onNextMonth,
    isFirst,
    isSecond,
}) => {
    const days = useMemo(() => getMonthDays(year, month), [year, month]);
    const firstDay = days[0]?.getDay() ?? 1;
    const blanks = (firstDay + 6) % 7;
    const calendar = [
        ...Array(blanks).fill(null),
        ...days
    ];

    // Lấy ngày hôm nay (yyyy-mm-dd)
    const todayStr = new Date().toISOString().slice(0, 10);

    return (
        <div className="rdrMonth">
            <div className="rdrMonthHeader" style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                {isFirst && (
                    <button type="button" onClick={onPrevMonth} className="rdrNavBtn" style={{ marginRight: 8 }}>&lt;</button>
                )}
                <div className="rdrMonthName" style={{ flex: 1, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span>{`Tháng ${month + 1} ${year}`}</span>
                </div>
                {isSecond && (
                    <button type="button" onClick={onNextMonth} className="rdrNavBtn" style={{ marginLeft: 8 }}>&gt;</button>
                )}
            </div>
            <div className="rdrWeekDays">
                {WEEK_DAYS.map((d, i) => (
                    <span className="rdrWeekDay" key={i}>{d}</span>
                ))}
            </div>
            <div className="rdrDays">
                {calendar.map((date, idx) => {
                    if (!date) {
                        return (
                            <button
                                key={idx}
                                type="button"
                                className="rdrDay rdrDayPassive"
                                tabIndex={-1}
                                disabled
                                style={{ background: "transparent", border: "none" }}
                            >
                                <span className="rdrDayNumber">&nbsp;</span>
                            </button>
                        );
                    }
                    const dStr = date.toISOString().slice(0, 10);
                    // Disable nếu trước hôm nay hoặc nằm trong disabledSet (kể cả hôm nay)
                    const isBeforeToday = dStr < todayStr;
                    const isDisabled = isBeforeToday || disabledSet.has(dStr);
                    const isInRange = rangeSet.has(dStr);
                    const isStart = from && dStr === from.toISOString().slice(0, 10);
                    const isEnd = to && dStr === to.toISOString().slice(0, 10);
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                    let className = "rdrDay";
                    if (isDisabled) className += " rdrDayPassive";
                    else {
                        if (isWeekend) className += " rdrDayWeekend";
                        if (isInRange) className += " rdrInRange";
                        if (isStart) className += " rdrStartEdge";
                        if (isEnd) className += " rdrEndEdge";
                    }

                    return (
                        <button
                            key={dStr}
                            type="button"
                            className={className}
                            tabIndex={isDisabled ? -1 : 0}
                            style={{ color: "#3d91ff" }}
                            disabled={isDisabled}
                            onClick={() => handleDayClick(date)}
                        >
                            <span className="rdrDayNumber">
                                <div className="MuiBox-root css-1qi084o">{date.getDate()}</div>
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const DatePicker = ({
    year,
    month,
    disabledDates = [],
    selectedRange = [],
    onSelectDate,
    onMonthChange,
}) => {
    // Mặc định là tháng hiện tại nếu không truyền vào
    const today = new Date();
    const [defaultYear, defaultMonth] = [today.getFullYear(), today.getMonth()];
    const displayYear = typeof year === "number" ? year : defaultYear;
    const displayMonth = typeof month === "number" ? month : defaultMonth;

    // Chuyển disabledDates sang dạng yyyy-mm-dd để so sánh
    const disabledSet = useMemo(
        () => new Set(disabledDates.map(d => new Date(d).toISOString().slice(0, 10))),
        [disabledDates]
    );

    // Xác định ngày đầu và cuối của range
    const from = selectedRange[0] ? new Date(selectedRange[0]) : null;
    const to = selectedRange[1] ? new Date(selectedRange[1]) : null;
    const rangeSet = useMemo(() => {
        if (from && to) {
            return new Set(getRange(from, to).map(d => d.toISOString().slice(0, 10)));
        }
        return new Set();
    }, [from, to]);

    // Xử lý chọn ngày: click lần 1 chọn from, click lần 2 chọn to (nếu đã có from và to thì reset)
    const handleDayClick = (date) => {
        const dStr = date.toISOString().slice(0, 10);
        // Disable nếu trước hôm nay hoặc nằm trong disabledSet (kể cả hôm nay)
        const todayStr = new Date().toISOString().slice(0, 10);
        if (dStr < todayStr || disabledSet.has(dStr)) return;

        if (!from || (from && to)) {
            // Chọn ngày bắt đầu mới
            onSelectDate && onSelectDate([date]);
        } else if (from && !to) {
            // Chỉ cho phép chọn ngày kết thúc >= ngày bắt đầu và không có ngày disabled ở giữa
            if (date < from) {
                onSelectDate && onSelectDate([date]);
            } else {
                // Kiểm tra các ngày giữa from và date có ngày nào bị disabled không
                let valid = true;
                let d = new Date(from);
                while (d <= date) {
                    const checkStr = d.toISOString().slice(0, 10);
                    const todayStr = new Date().toISOString().slice(0, 10);
                    if (
                        (checkStr < todayStr || disabledSet.has(checkStr)) &&
                        checkStr !== from.toISOString().slice(0, 10) &&
                        checkStr !== date.toISOString().slice(0, 10)
                    ) {
                        valid = false;
                        break;
                    }
                    d.setDate(d.getDate() + 1);
                }
                if (valid) {
                    onSelectDate && onSelectDate([from, date]);
                }
            }
        }
    };

    // Chuyển tháng
    const handlePrevMonth = () => {
        if (onMonthChange) {
            let [prevYear, prevMonth] = addMonth(displayYear, displayMonth, -1);
            onMonthChange(prevYear, prevMonth);
        }
    };
    const handleNextMonth = () => {
        if (onMonthChange) {
            let [nextYear, nextMonth] = addMonth(displayYear, displayMonth, 1);
            onMonthChange(nextYear, nextMonth);
        }
    };

    // Tháng tiếp theo
    const [nextYear, nextMonth] = addMonth(displayYear, displayMonth, 1);

    return (
        <div className="rdrMonthsHorizontal">
            <MonthCalendar
                year={displayYear}
                month={displayMonth}
                disabledSet={disabledSet}
                from={from}
                to={to}
                rangeSet={rangeSet}
                handleDayClick={handleDayClick}
                showNav={false}
                isFirst={true}
                onPrevMonth={handlePrevMonth}
            />
            <MonthCalendar
                year={nextYear}
                month={nextMonth}
                disabledSet={disabledSet}
                from={from}
                to={to}
                rangeSet={rangeSet}
                handleDayClick={handleDayClick}
                showNav={false}
                isSecond={true}
                onNextMonth={handleNextMonth}
            />
        </div>
    );
};

export default DatePicker;