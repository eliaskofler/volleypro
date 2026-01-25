import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold">Welcome to our App!</h1>
            <Link
                to="/waitlist"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
                Join the Waitlist
            </Link>
        </div>
    );
}

export default Home;