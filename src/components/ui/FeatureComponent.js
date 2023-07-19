import Image from "next/image";
import React from "react";

export default function FeatureComponent({
  src,
  activeImage,
  width,
  id,
  setActiveFeature,
}) {
  return (
    <>
      <Image
        src={src}
        width={width}
        height={0}
        className={
          activeImage === id
            ? "scale-125 duration-150 drop-shadow-xl z-10"
            : "hover:scale-125 duration-150 drop-shadow-xl"
        }
        onMouseEnter={() => setActiveFeature(id)}
      />
    </>
  );
}
