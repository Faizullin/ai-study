import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";
import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import useEffectInitial from "@/core/hooks/useEffectInitial";
import { modalIds, openModal } from "@/core/redux/store/reducers/modalSlice";
import { closeHeaderSearchbar } from "@/core/redux/store/reducers/searchSidebarSlice";

import "./search-sidebar.scss";

export default function SearchSidebar() {
  const dispatch = useAppDispatch();
  const { isHeaderSearchBarOpen, documents } = useAppSelector(
    (state) => state.searchSidebar
  );
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = (event: any) => {
    event?.preventDefault();
    dispatch(closeHeaderSearchbar());
  };
  useEffect(() => {
    if (isHeaderSearchBarOpen) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
    document.body.style.overflow = isHeaderSearchBarOpen ? "hidden" : "unset";
    setIsOpen(isHeaderSearchBarOpen);
    return () => {
      // document.body.style.overflow = "auto";
    };
  }, [isHeaderSearchBarOpen]);

  return (
    <div className={`search-sidebar-back ${isOpen ? "open" : ""}`}>
      <section className="clients">
        <div className="container">
          <div className="d-flex justify-content-between">
            <div></div>
            <a href="#" onClick={handleClose}>
              <Icon path={mdiClose} size={1} />
            </a>
          </div>
          <div className="mt mt-3">
            <ul className="list-group">
              {documents.map((document) => (
                <li
                  key={document.id}
                  className={`search-result-item list-group-item d-flex justify-content-between ${
                    false ? "active" : ""
                  }`}
                  onClick={async () => {
                    dispatch(
                      openModal({
                        id: modalIds.documentItemDetailPopup,
                        props: {
                          item: document,
                        },
                        closeOther: true,
                      })
                    );
                  }}
                >
                  <p className="p-0 m-0">{document.title}</p>
                  <p className="p-0 m-0">{document.created_at}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
