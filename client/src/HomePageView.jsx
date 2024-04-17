function HomePageView(props){
    return(
        <div>
            <h1>Control Panel</h1>
            {props.isDispensing
                ? <button onClick={props.onStopDispensing}>Stop</button>
                : <button onClick={props.onStartDispensing}>Start</button>
            }
        </div>
    )
}
export default HomePageView;
