import React from 'react';


interface SwitchViewProps {
    setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

function SwitchView(props: SwitchViewProps) {

    function onChangeHandler(e: React.FormEvent<HTMLInputElement>) {
        props.setCurrentView((e.target as HTMLInputElement).value);
    }

    return (
        <>
            <div className="switch-field" onChange={onChangeHandler}>
                <input type="radio" id="radio-all" name="view-switch" value="all" defaultChecked />
                <label htmlFor="radio-one">All</label>
                <input type="radio" id="radio-faves" name="view-switch" value="faves" />
                <label htmlFor="radio-two">Faves</label>
            </div>
        </>
    )
}

export default SwitchView
