import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SubHeader from "../components/SubHeader";
import axios from "axios";
import BASE_URL from "../Confi/baseurl";

export default function CampaignDetails() {
  const { id } = useParams();
  const storedValue = sessionStorage.getItem("selectedId");
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");

  //   const formatDate = (dateString) => {
  //     const date = new Date(dateString);
  //     const day = String(date.getDate()).padStart(2, "0");
  //     const month = String(date.getMonth() + 1).padStart(2, "0");
  //     const year = String(date.getFullYear());

  //     return `${day}-${month}-${year}`;
  //   };

  const getMemberDetails = async (id) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/loyalty/campaigns/${id}.json?token=${token}&&q[loyalty_type_id_eq]=${storedValue}`
      );
      // setCampaignDetails(response.data)
      return response.data;

      // const formattedMember = {
      //   ...response.data,
      //   created_at: formatDate(response.data.created_at), // Format the created_at date
      // };

      // return formattedMember;
    } catch (error) {
      console.error("Error fetching member details:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const data = await getMemberDetails(id);
        setCampaignDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  return (
    <div className="w-100">
      {/* <SubHeader /> */}
      <div className="module-data-section mt-2 mb-2">
        <p className="pointer">
          <Link to="/campaign">
            <span>Campaign</span>
          </Link>
          &gt; Campaign Details
        </p>

        {/* personal details */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <>
            <div
              // @ts-ignore
              class="go-shadow mx-3 no-top-left-shadow "
              style={{ fontSize: "14px", fontWeight: "400", color: "#6C757D" }}
            >
              <h5
                // @ts-ignore
                class="d-flex"
              >
                <span
                  // @ts-ignore
                  class="title mt-3"
                >
                  CAMPAIGN DETAILS
                </span>
              </h5>
              <div
                // @ts-ignore
                class="row px-3"
              >
                <div
                  // @ts-ignore
                  class="col-lg-8 col-md-12 col-sm-12 row px-3"
                >
                  <div
                    // @ts-ignore
                    class="col-6 p-1 text-muted member-detail-color"
                  >
                    Campaign Name
                  </div>
                  <div
                    // @ts-ignore
                    class="col-6 p-1 member-detail-color"
                  >
                    :{" "}
                    {
                      // @ts-ignore
                      campaignDetails?.name
                    }
                  </div>
                </div>
                <div
                  // @ts-ignore
                  class="col-lg-8 col-md-6 col-sm-12 row px-3"
                >
                  <div
                    // @ts-ignore
                    class="col-6 p-1 text-muted member-detail-color"
                  >
                    Campaign Tag
                  </div>
                  <div
                    // @ts-ignore
                    class="col-6 p-1 member-detail-color"
                  >
                    :{" "}
                    {
                      // @ts-ignore
                      campaignDetails?.campaign_tag
                    }
                  </div>
                </div>
                <div
                  // @ts-ignore
                  class="col-lg-8 col-md-6 col-sm-12 row px-3"
                >
                  <div
                    // @ts-ignore
                    class="col-6 p-1 text-muted member-detail-color"
                  >
                    Target Audience
                  </div>
                  <div
                    // @ts-ignore
                    class="col-6 p-1 member-detail-color"
                  >
                    :{" "}
                    {
                      // @ts-ignore
                      campaignDetails?.target_audiance
                    }
                  </div>
                </div>
                {/* <div class="col-lg-8 col-md-6 col-sm-12 row px-3">
                  <div class="col-6 p-1 text-muted member-detail-color">
                    Welcome Bonus
                  </div>
                  <div class="col-6 p-1 member-detail-color">
                    : {" "}{tierDetails?.welcome_bonus}
                  </div>
                </div> */}
                {/* <div class="col-lg-8 col-md-6 col-sm-12 row px-3">
                  <div class="col-6 p-1 text-muted member-detail-color">
                    Point Type
                  </div>
                  <div class="col-6 p-1 member-detail-color">
                    : {" "}{tierDetails?.point_type}
                  </div>
                </div> */}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
