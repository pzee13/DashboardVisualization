
import PropTypes from 'prop-types';

const Statistics = ({ sectors, countries, topics }) => {
    return (
        <section className="py-10 bg-gray-900 sm:py-16 lg:py-24">
            <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">Key Statistics</h2>
                    <p className="mt-3 text-xl leading-relaxed text-gray-100 md:mt-8">
                        Discover the scale of our impact through these key statistics.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 mt-10 text-center lg:mt-24 sm:gap-x-8 md:grid-cols-3">
                    <div>
                        <h3 className="font-bold text-7xl">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-blue-600">
                                {sectors}
                            </span>
                        </h3>
                        <p className="mt-4 text-xl font-medium text-gray-900">Total Sectors</p>
                        <p className="text-base mt-0.5 text-gray-500">Diverse sectors we cover</p>
                    </div>

                    <div>
                        <h3 className="font-bold text-7xl">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-blue-600">
                                {countries}
                            </span>
                        </h3>
                        <p className="mt-4 text-xl font-medium text-gray-900">Total Countries</p>
                        <p className="text-base mt-0.5 text-gray-500">Countries we operate in</p>
                    </div>

                    <div>
                        <h3 className="font-bold text-7xl">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-blue-600">
                                {topics}
                            </span>
                        </h3>
                        <p className="mt-4 text-xl font-medium text-gray-900">Total Topics</p>
                        <p className="text-base mt-0.5 text-gray-500">Topics covered in our research</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

Statistics.propTypes = {
    sectors: PropTypes.number.isRequired,
    countries: PropTypes.number.isRequired,
    topics: PropTypes.number.isRequired
};

export default Statistics;
