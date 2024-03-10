import React, { FC } from "react";
import { IDocument } from "@/core/models/IDocument";
import "./document-item-card.scss";
import { Img } from "@/core/constants/img";

interface IDocumentItemCardProps {
  item: IDocument;
  onOpen: () => void;
}

const max_title_truncated_count = 65;
const max_description_truncated_count = 95;

const DocumentItemCard: FC<IDocumentItemCardProps> = ({ item, onOpen }) => {
  const handleOpen = (event: any) => {
    event?.preventDefault();
    onOpen();
  };
  const title_truncated =
    item.title.length > max_title_truncated_count
      ? item.title.substring(0, max_title_truncated_count) + "..."
      : item.title;
  const description_truncated =
    item.description.length > max_description_truncated_count
      ? item.description.substring(0, max_description_truncated_count) + "..."
      : item.description;
  return (
    <div className="document-item-card d-flex flex-column">
      <a
        href="#"
        className="document-item-card__thumbnail overflow-hidden"
        onClick={handleOpen}
      >
        <img
          src={item.featured_image?.url || Img.not_found}
          alt=""
          className="w-100 h-100 object-fit-cover"
        />
      </a>
      <div className="d-flex flex-column">
        <p className="document-item-card__title">{title_truncated}</p>
        <p className="document-item-card__description m-0">
          {description_truncated}
        </p>
      </div>
    </div>
  );
};

export default DocumentItemCard;
