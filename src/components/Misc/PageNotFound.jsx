import { Result } from 'antd'
import { Link } from 'react-router-dom';

const PageNotFound = () => (
    <>
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Link to="/" className='btn btn-primary' >Back Home</Link>}
        />
    </>
)
export default PageNotFound