import React, { FC } from "react";
import "./loading-document-item-card.scss";

interface ILoadingDocumentItemCardProps {}

const LoadingDocumentItemCard: FC<ILoadingDocumentItemCardProps> = () => {
  const handleOpen = (event: any) => {
    event?.preventDefault();
  };
  return (
    <div className="loading-document-item-card d-flex flex-column">
      <a
        href="#"
        className="loading-document-item-card__thumbnail overflow-hidden"
        onClick={handleOpen}
      >
        <div className="w-100 h-100 object-fit-cover thumb pulse"></div>
      </a>
      <div className="d-flex flex-column">
        <p className="loading-document-item-card__title line pulse"></p>
        <p className="loading-document-item-card__description m-0 line pulse"></p>
      </div>
    </div>
  );
};

export default LoadingDocumentItemCard;

interface ILoadingDocumentGridProps {
  count: number;
}

export const LoadingDocumentGrid: FC<ILoadingDocumentGridProps> = ({
  count,
}) => {
  const arr = Array(count).fill(1);
  return arr.map((_, index) => (
    <div
      key={index}
      className="col-12 col-md-6 d-flex justify-content-center d-md-block"
    >
      <LoadingDocumentItemCard key={index} />
    </div>
  ));
};
