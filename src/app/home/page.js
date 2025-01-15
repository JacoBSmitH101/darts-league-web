export default function HomePage() {
    return (
        <div className="text-white text-center py-10">
            <h2 className="text-2xl font-semibold">
                Welcome to the Home Page!
            </h2>
            <p>
                This page will eventually show your stats, recent matches and
                more... For now you can see your matches and the standings for
                all divisions via the bar at the top
            </p>

            <iframe
                src="https://challonge.com/d9k30b1r/module"
                width="100%"
                height="500"
                frameborder="0"
                scrolling="auto"
                allowtransparency="true"
            ></iframe>
        </div>
    );
}
