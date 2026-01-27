import MostLoved from "./MostLoved";
import { PiGreaterThan } from "react-icons/pi";

const HurryUp = ({ product }) => {
  // console.log(product);
  return (
    <>
      <div className="section-1 mx-5 exclusive-offer-section">
        <h3 className="fw-bold fs-2">Hurry Up!</h3>
        <h2 className="fw-bold fs-1 py-2">Exclusive Offer Today!</h2>
        <h5 className="fw-bold w-50">
          Design of the Day! Bring Home This Exquisite Tanjore Art at 20% Off
        </h5>
        <button className="btn-in mt-4 px-4 py-2">
          Shop Now   
          <span className="mx-1 text-center">
            <PiGreaterThan/>
          </span>
        </button>
      </div>
      <MostLoved product={product} />
    </>
  );
};

export default HurryUp;
