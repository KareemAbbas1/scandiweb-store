import './pageHeader.scss'

const Header = ({title, buttons}) => {
  return (
    <div className="header">
      <h1>{title}</h1>
      <div>{buttons}</div>
    </div>
  )
}

export default Header