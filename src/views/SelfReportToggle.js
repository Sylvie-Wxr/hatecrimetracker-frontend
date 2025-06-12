import './SelfReportToggle.css';

const SelfReportToggle = ({ isOn, handleToggle }) => {
  return (
    <div className="toggle-wrapper">
      <div
        className={`toggle-switch ${isOn ? 'on' : 'off'}`}
        onClick={() => handleToggle(!isOn)}
      >
        <div className="toggle-circle">{isOn ? 'on' : 'off'}</div>
      </div>
      <span className={`toggle-label ${isOn ? 'label-on' : 'label-off'}`}>
        Show Self-report incidents
      </span>
    </div>
  );
};

export default SelfReportToggle;
