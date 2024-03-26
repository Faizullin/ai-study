import React from "react";
import { IDocument } from "@/core/models/IDocument";
import Icon from "@mdi/react";
import { mdiArrowRight } from "@mdi/js";
import { Img } from "@/core/constants/img";

const max_title_truncated_count = 65;
const max_description_truncated_count = 95;

export const PopularDocumentItemCard = ({
  item,
  onDocumentDetailClick,
}: {
  item: IDocument;
  onDocumentDetailClick: (item: IDocument) => void;
}) => {
  const title_truncated =
    item.title.length > max_title_truncated_count
      ? item.title.substring(0, max_title_truncated_count) + "..."
      : item.title;
  const description_truncated =
    item.description.length > max_description_truncated_count
      ? item.description.substring(0, max_description_truncated_count) + "..."
      : item.description;
  const handleOpen = (event: any) => {
    event?.preventDefault();
    onDocumentDetailClick(item);
  };
  return (
    <div className="popular-document-item-card row mx-auto mx-md-0" data-aos="fade-right">
      <a
        href="#"
        className="popular-document-item-card__thumbnail col-5 col-md-4 px-0 h-100 overflow-hidden"
        onClick={handleOpen}
      >
        <img
          src={item.featured_image?.url || Img.not_found}
          alt={item.featured_image?.url}
          className="object-fit-cover w-100 h-100"
        />
      </a>
      <div className="col-7 col-md-8 h-100 ps-md-4">
        <p className="popular-document-item-card__title">{title_truncated}</p>
        <p className="popular-document-item-card__description d-none d-md-block">
          {description_truncated}
        </p>
        <div className="d-flex justify-content-between">
          <p className="popular-document-item-card__timestamp">
            {item.created_at}
          </p>
          <button
            className="btn bg-transparent"
            onClick={handleOpen}
          >
            <Icon path={mdiArrowRight} size={1} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const LoadingPopularDocumentItemCard = () => {
  const handleOpen = (event: any,) => {
    event?.preventDefault();
  };
  return (
    <div className="popular-document-item-card row mx-auto mx-md-0">
      <a
        href="#"
        className="popular-document-item-card__thumbnail col-5 col-md-4 px-0 h-100 overflow-hidden"
        onClick={handleOpen}
      >
        <div className="object-fit-cover w-100 h-100 pulse thumb"></div>
      </a>
      <div className="col-7 col-md-8 h-100 ps-md-4">
        <p className="popular-document-item-card__title pulse line"></p>
        <p className="popular-document-item-card__description d-none d-md-block pulse line">
        </p>
        <div className="d-flex justify-content-between">
          <p className="popular-document-item-card__timestamp pulse line">
            
          </p>
          <button
            className="btn bg-transparent"
            onClick={handleOpen}
          >
            <Icon path={mdiArrowRight} size={1} />
          </button>
        </div>
      </div>
    </div>
  );
};
