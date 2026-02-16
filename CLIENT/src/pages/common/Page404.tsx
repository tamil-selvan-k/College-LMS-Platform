import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4">

      {/* Platform Name */}
      <h1 className="mb-2 text-3xl font-semibold text-[var(--text-primary)]">
        LMS Platform
      </h1>

      

      {/* Card */}
      <div className="w-full max-w-md rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] p-10 shadow-lg">

        {/* 404 */}
        <h2 className="text-center text-6xl font-bold custom-hilight bg-clip-text text-transparent">
          404
        </h2>

        <p className="mt-2 text-center text-sm font-medium text-[var(--text-primary)]">
          Page not found
        </p>

        <p className="mt-5 text-center text-sm text-[var(--text-secondary)] leading-relaxed">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Button */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="button-hilight rounded-md px-6 py-2 text-sm font-medium text-white transition hover:scale-105"
          >
            Go to Home
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Page404;
