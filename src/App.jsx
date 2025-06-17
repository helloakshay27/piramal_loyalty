import React from "react";

import Members from "./pages/members";
import Tiers from "./pages/tier";
import MemberDetails from "./pages/member-details";
import RuleEngine from "./pages/rule-engine";
import TierSetting from "./pages/tier-setting";
import Segment from "./pages/segment";
import Campaign from "./pages/campaign";
import NewCampaign from "./pages/new-campaign";
import NewSegment from "./pages/new-segment";
import ViewRuleEngine from "./pages/view-rule-engine";
import CreateRuleEngine from "./pages/create-rule-engine";
import NewTier from "./pages/new-tier";
import Test from "./pages/test";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignIn from "./login/SignIn";
import RootLayout from "./pages/Layout/RootLayout";
import ProtectedRoute from "./login/ProtectedRoute";
import ViewSegment from "./pages/view-segment";
import TierDetails from "./pages/tier-details";
import SelectSubToMain from "./pages/SelectSubToMain";
import CampaignDetails from "./pages/campaign-details";
import EditSegment from "./pages/edit-segment";
import EditRuleEngine from "./pages/edit-rule-engine";
import PageNotFound from "./pages/page-not-found";


import ProjectDetailsCreate from "./pages/project-details-create";
import BannerList from "./pages/banner-list";
import BannerAdd from "./pages/banner-add";
import ProjectDetailsList from "./pages/project-details-list";
import Amenities from "./pages/amenities";
import Testimonials from "./pages/testimonials";
import Gallery from "./pages/gallery";
import { Toast } from "bootstrap";
import { Toaster } from "react-hot-toast";
import ProjectDetailsEdit from "./pages/project-details-edit";
import TestimonialList from "./pages/testimonial-list";
import ProjectDetails from "./pages/project-details";
import AmenitiesList from "./pages/amenities-list";
import NewGallery from "./pages/new-gallery";
import GalleryList from "./pages/gallery-list";
import GalleryDetails from "./pages/gallery-details";
import EditGallery from "./pages/edit-gallery";
import EditAmenities from "./pages/edit-amenities";
import BannerEdit from "./pages/banner-edit";
import TestimonialEdit from "./pages/testimonial-edit";
import EventCreate from "./pages/event-create";
import Referrallist from "./pages/referral-list";
import Referralcreate from "./pages/referral-create";
import Eventlist from "./pages/event-list";
import EventDetails from "./pages/event-details";
import Specification from "./pages/specification";
import SpecificationList from "./pages/specification-list";
import SpecificationUpdate from "./pages/specification-update";
import EventEdit from "./pages/event-edit";
import SitevisitCreate from "./pages/sitevisit-create";
import SiteVisitSlotConfig from "./pages/siteVisit-SlotConfig";
import SiteVisitSlotConfigList from "./pages/siteVisit-SlotConfig-list";
import SitevisitList from "./pages/sitevisit-list";
import OrganizationCreate from "./pages/organization-create";
import SitevisitEdit from "./pages/sitevisit-edit";
import OrganizationList from "./pages/organization-list";
import CompanyCreate from "./pages/company-create";
import PressReleasesCreate from "./pages/press-releases-create";

import SupportServiceList from "./pages/support-service-list";

import PressReleasesList from "./pages/press-releases-list";
import ProjectConfiguraion from "./pages/project-configuraion";
import ProjectConfiguraionList from "./pages/project-configuraion-list";
import PressReleasesEdit from "./pages/press-releases-edit";
import CompanyList from "./pages/company-list";
import CompanyEdit from "./pages/company-edit";
import OrganizationUpdate from "./pages/organization-update";
import ProjectConfigEdit from "./pages/project-config-edit";
import EnquiryList from "./pages/Enquiry-list";
import PropertyType from "./pages/property-type";
import PropertyTypeList from "./pages/property-type-list";
import ProjectBuildingType from "./pages/project-building-type";
import ProjectBuildingTypeList from "./pages/project-building-type-list";
import ProjectBuildingTypeEdit from "./pages/project-building-type-edit";
import ConstructionStatus from "./pages/construction-status";
import ConstructionStatusList from "./pages/construction-status-list";
import ConstructionStatusEdit from "./pages/construction-status-edit";
import PropertyTypeEdit from "./pages/property-type-edit";
import SetupMember from "./pages/setup-member";
import CategoryTypes from "./pages/category-types";
import CategoryTypesList from "./pages/category-types-list";
import CategoryTypesEdit from "./pages/category-types-edit";
import TagAdd from "./pages/tag-add";
import ReferralCreate from "./pages/referral-create";
import DemandNotes from "./pages/demand-notes";
import HomeLoanRequest from "./pages/home-loan-request";


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RootLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/members" />} />
            <Route path="/members" element={<Members />} />
            <Route path="/segment" element={<Segment />} />
            <Route path="/campaign" element={<Campaign />} />
            <Route path="/campaign-details/:id" element={<CampaignDetails />} />
            <Route path="/new-segment" element={<NewSegment />} />
            <Route path="/new-campaign" element={<NewCampaign />} />
            <Route path="/member-details/:id" element={<MemberDetails />} />
            <Route path="/rule-engine" element={<RuleEngine />} />
            <Route path="/create-rule-engine" element={<CreateRuleEngine />} />
            <Route path="/view-rule-engine/:id" element={<ViewRuleEngine />} />
            <Route path="/edit-rule-engine/:id" element={<EditRuleEngine />} />
            <Route path="/tier-setting" element={<TierSetting />} />
            <Route path="/tiers" element={<Tiers />} />
            <Route path="/new-tier" element={<NewTier />} />
            <Route path="/tier-details/:id" element={<TierDetails />} />
            <Route path="/test" element={<Test />} />
            <Route path="/view-segment/:id" element={<ViewSegment />} />
            <Route path="/SelectSubToMain" element={<SelectSubToMain/>} />

            <Route path="/edit-segment/:id" element={<EditSegment />} />
            <Route path="*" element={<PageNotFound />} />

               <Route path="/project-create" element={<ProjectDetailsCreate />} />
          <Route path="/project-edit/:id" element={<ProjectDetailsEdit />} />
          <Route path="/project-details/:id" element={<ProjectDetails />} />
          <Route path="/setup-member/property-type" element={<PropertyType />}/>
          <Route path="/setup-member/property-type-edit/:id" element={<PropertyTypeEdit />}/>
          <Route path="/setup-member/property-type-list" element={<PropertyTypeList/>}/>
          <Route path="/setup-member/project-building-type" element={<ProjectBuildingType/>}/>
          <Route path="/setup-member/project-building-type-edit/:id" element={<ProjectBuildingTypeEdit/>}/>

          <Route path="/setup-member/project-building-type-list" element={<ProjectBuildingTypeList/>}/>
          <Route path="/setup-member/construction-status" element={<ConstructionStatus />} />
          <Route path="/setup-member/construction-status-edit/:id" element={<ConstructionStatusEdit />} />

          <Route path="/setup-member/construction-status-list" element={<ConstructionStatusList />} />
          

          <Route path="/project-list" element={<ProjectDetailsList />} />
          <Route path="/banner-list" element={<BannerList />} />
          <Route path="/banner-add" element={<BannerAdd />} />
          <Route path="/setup-member/amenities" element={<Amenities />} />
          <Route path="/setup-member/amenities-list" element={<AmenitiesList />} />
          <Route path="/setup-member/edit-amenities/:id" element={<EditAmenities />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/testimonial-list" element={<TestimonialList />} />
          <Route path="/testimonial-edit" element={<TestimonialEdit />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery-details/:id" element={<GalleryDetails />} />
          <Route path="/new-gallery" element={<NewGallery />} />
          <Route path="/gallery-list" element={<GalleryList />} />
          <Route path="/edit-gallery/:id" element={<EditGallery />} />
          <Route path="/banner-edit/:id" element={<BannerEdit />} />
          <Route path="/event-create" element={<EventCreate />} />
          <Route path="/referral-create" element={<ReferralCreate />} />
          <Route path="/referral-list" element={<Referrallist />} />
          <Route path="/demand-notes" element={<DemandNotes />} />
          <Route path="/home-loan-request" element={<HomeLoanRequest />} />
          <Route path="/event-list" element={<Eventlist />} />
          <Route path="/event-details/:id" element={<EventDetails />} />
          <Route path="/event-details" element={<EventDetails />} />
          <Route path="/event-edit/:id" element={<EventEdit />} />
          <Route path="/specification" element={<Specification />} />
          <Route path="/organization-create" element={<OrganizationCreate />} />
          <Route path="/organization-list" element={<OrganizationList />} />
          <Route path="/enquiry-list" element={<EnquiryList />} />
          <Route
            path="/organization-update/:id"
            element={<OrganizationUpdate />}
          />
          <Route
            path="/specification-update/:id"
            element={<SpecificationUpdate />}
          />
          <Route path="/specification-list" element={<SpecificationList />} />
          <Route path="/sitevisit-create" element={<SitevisitCreate />} />
          <Route path="/sitevisit-list" element={<SitevisitList />} />
          <Route path="/sitevisit-edit/:id" element={<SitevisitEdit />} />
          <Route
            path="/setup-member/siteslot-create"
            element={<SiteVisitSlotConfig />}
          />
          <Route
            path="/setup-member/siteslot-list"
            element={<SiteVisitSlotConfigList />}
          />
          <Route path="/company-create" element={<CompanyCreate />} />
          <Route path="/company-list" element={<CompanyList />} />
          <Route path="/company-edit/:id" element={<CompanyEdit />} />
          <Route path="/setup-member/category-types" element={<CategoryTypes />} />
          <Route path="/setup-member/category-types-list" element={<CategoryTypesList />} />
          <Route path="/setup-member/category-types-edit/:id" element={<CategoryTypesEdit />} />
          <Route path="/setup-member/tag-add" element={<TagAdd />} />

          <Route
            path="/pressreleases-create"
            element={<PressReleasesCreate />}
          />
          <Route
            path="/support-service-list"
            element={<SupportServiceList />}
          />
          <Route path="/pressreleases-list" element={<PressReleasesList />} />
          <Route
            path="/pressreleases-edit/:id"
            element={<PressReleasesEdit />}
          />
          <Route
            path="/setup-member/project-configuration"
            element={<ProjectConfiguraion />}
          />
          <Route path="/setup-member/project-config-edit/:id"
          element={<ProjectConfigEdit/>}/>
          <Route
            path="/setup-member/project-configuration-list"
            element={<ProjectConfiguraionList />}
          />

          <Route path="/setup-member" element={<SetupMember />} />



          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
