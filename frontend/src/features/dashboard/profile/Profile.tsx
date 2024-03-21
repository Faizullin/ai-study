import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";
import PrimaryButton from "@/shared/components/buttons/primary-button/PrimaryButton";
import AvatarImg from "@/shared/components/avatar/AvatarImg";
import { Tab, Tabs } from "react-bootstrap";
import SecondaryButton from "@/shared/components/buttons/secondary-button/SecondaryButton";
import useEffectInitial from "@/core/hooks/useEffectInitial";
import {
  fetchUpdateProfile,
  fetchUserData,
} from "@/core/redux/store/reducers/userSlice";
import { fetchUserData as fetchUserDataAndSave } from "@/core/redux/store/reducers/authSlice";

import "./profile.scss";
import { FormattedMessage } from "react-intl";

type TViewMode = "view" | "edit";

export default function Profile() {
  const dispath = useAppDispatch();
  const { user: authUser, loading } = useAppSelector((state) => state.auth);
  const [viewMode, setViewMode] = useState<TViewMode>("view");
  const [formData, setFormData] = useState({
    username: "",
  });
  const hiddenFileInput = useRef(null);

  const handleViewModeChange = () => {
    if (viewMode === "edit") {
      setViewMode("view");
    } else {
      setViewMode("edit");
    }
  };
  const handleAvatarChange = () => {
    if (viewMode === "edit" && !loading.post) {
      hiddenFileInput.current.click();
    }
  };
  const handleAvatarUpload = (event: any) => {
    if (viewMode === "edit" && !loading.post) {
      const fileUploaded = event.target.files[0];
      const data = new FormData();
      data.append("image", fileUploaded);
      dispath(fetchUpdateProfile(data)).then((response) => {
        if (response.type === fetchUpdateProfile.fulfilled.toString()) {
          dispath(fetchUserDataAndSave());
          setViewMode("view");
        }
      });
    }
  };

  const handleFormValueChange = (event: any) => {
    setFormData((formData) => ({
      ...formData,
      [event.target.name]: event.target.value,
    }));
  };
  const handleFormSave = () => {
    if (viewMode === "edit") {
      const data = new FormData();
      // if (true) {
      //   data.append("image", null);
      // }
      // data.append("username", formData.username);
      // dispath(fetchUpdateProfile(data)).then((response) => {
      //   if (response.type === fetchUpdateProfile.fulfilled.toString()) {
      //     dispath(fetchUserData());
      //   }
      // });
    }
  };

  useEffectInitial(() => {
    if (viewMode === "edit" && authUser) {
      setFormData({
        username: authUser.username,
      });
    }
  }, [viewMode]);

  return (
    <main className="profile-page d-flex flex-grow-1">
      <section className="d-flex flex-grow-1">
        <div className="container d-flex flex-grow-1">
          {/* <div className="col-md-12 col-sm-12 col-xs-12 image-section">
          <img src="https://png.pngtree.com/thumb_back/fw800/back_pic/00/08/57/41562ad4a92b16a.jpg" />
        </div> */}
          <div className="row user-left-part d-flex flex-grow-1">
            <div className="col-md-3 col-sm-3 col-xs-12 user-profil-part pull-left">
              <div className="row ">
                <div className="col-md-12 col-md-12-sm-12 col-xs-12 user-image d-flex justify-content-center">
                  {/* <img
                src="https://www.jamf.com/jamf-nation/img/default-avatars/generic-user-purple.png"
                className="rounded-circle"
              /> */}
                  <AvatarImg
                    src={authUser.profile?.url}
                    onClick={handleAvatarChange}
                  />
                  <input
                    type="file"
                    onChange={handleAvatarUpload}
                    ref={hiddenFileInput}
                    style={{ display: "none" }} // Make the file input element invisible
                  />
                </div>
                {/* <div className="col-md-12 col-sm-12 col-xs-12 user-detail-section1 text-center">
                <button
                  id="btn-contact"
                  data-toggle="modal"
                  data-target="#contact"
                  className="btn btn-success btn-block follow"
                >
                  Contactarme
                </button>
                <button className="btn btn-warning btn-block">
                  Descargar Curriculum
                </button>
              </div> */}
                {/* <div className="row user-detail-row">
                <div className="col-md-12 col-sm-12 user-detail-section2 pull-left">
                  <div className="border" />
                  <p>FOLLOWER</p>
                  <span>320</span>
                </div>
              </div> */}
              </div>
            </div>
            <div className="col-md-9 col-sm-9 col-xs-12 profile-right-section clients">
              <div className="row profile-right-section-row">
                <div className="col-md-12 profile-header">
                  <div className="row">
                    <div className="col-md-8 col-sm-6 col-xs-6 profile-header-section1 pull-left">
                      <h1>{authUser.username}</h1>
                      <h5>{authUser.roles.map((item) => item)}</h5>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-6 profile-header-section1 text-right pull-rigth">
                      {true && (
                        <>
                          {viewMode === "view" && (
                            <PrimaryButton
                              className="px-5"
                              onClick={handleViewModeChange}
                            >
                              <FormattedMessage
                                id="edit"
                                defaultMessage="Edit"
                              />
                            </PrimaryButton>
                          )}
                          {viewMode === "edit" && (
                            <>
                              <PrimaryButton
                                className="px-5"
                                onClick={handleFormSave}
                                processing={loading.post}
                              >
                                <FormattedMessage
                                  id="save"
                                  defaultMessage="Save"
                                />
                              </PrimaryButton>
                              <SecondaryButton
                                className="px-5"
                                onClick={handleViewModeChange}
                              >
                                <FormattedMessage
                                  id="cancel"
                                  defaultMessage="Cancel"
                                />
                              </SecondaryButton>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <Tabs defaultActiveKey="user-data" className="mb-3">
                    <Tab eventKey="user-data" title="User data">
                      <div className="tab-pane fade show active user-data-tabpanel">
                        <div className="row">
                          <div className="col-md-2">
                            <label>ID</label>
                          </div>
                          <div className="col-md-6">
                            <p>{authUser.id}</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-2">
                            <label>Username</label>
                          </div>
                          <div className="col-md-6">
                            {/* {viewMode === "edit" ? (
                              <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleFormValueChange}
                              />
                            ) : (
                              <p>{authUser.username}</p>
                            )} */}
                            <p>{authUser.username}</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-2">
                            <label>Email</label>
                          </div>
                          <div className="col-md-6">
                            <p>{authUser.email}</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-2">
                            <label>Role</label>
                          </div>
                          <div className="col-md-6">
                            {authUser?.roles.map((item, index) => (
                              <p key={index}>{item}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
