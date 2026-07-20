const Footer = () => {
  return (
    <footer className="border-t mt-12 py-6 text-center text-sm text-gray-500">
      <p>CareerTrack Lite &copy; {new Date().getFullYear()}</p>
      <p className="mt-1">
        Built by <span className="font-medium">Taslima Akter</span> | Student ID: <span className="font-medium">WEB12-2453</span>
      </p>
    </footer>
  );
};

export default Footer;