import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import MultiSelectBox from "../components/base/MultiSelectBox";
import SelectBox from "../components/base/SelectBox";
import BASE_URL from "../Confi/baseurl";

const ProjectDetailsEdit = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Property_Type: "",
    building_type: "",
    SFDC_Project_Id: "",
    Project_Construction_Status: "",
    Configuration_Type: [],
    Project_Name: "",
    project_address: "",
    Project_Description: "",
    Price_Onward: "",
    Project_Size_Sq_Mtr: "",
    Project_Size_Sq_Ft: "",
    development_area_sqft: "",
    development_area_sqmt: "",
    Rera_Carpet_Area_Sq_M: "",
    Rera_Carpet_Area_sqft: "",
    Rera_Sellable_Area: "",
    Number_Of_Towers: "",
    Number_Of_Units: "",
    no_of_floors: "",
    Rera_Number_multiple: [{ tower_name: "", rera_number: "" }],
    Amenities: [],
    Specifications: [],
    Land_Area: "",
    land_uom: "",
    project_tag: "",
    virtual_tour_url_multiple: [],
    map_url: "",
    image: [],
    Address: {
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      pin_code: "",
      country: "",
    },
    ProjectBrochure: [],
    videos: [],
    gallery_image: [],
    fetched_gallery_image: [],
  });

  // console.log("formData", formData);

  const [projectsType, setProjectsType] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [towerName, setTowerName] = useState("");
  const [reraNumber, setReraNumber] = useState("");
  const [virtualTourUrl, setVirtualTourUrl] = useState("");
  const [virtualTourName, setVirtualTourName] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [filteredAmenities, setFilteredAmenities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [projectCreatives, setProjectCreatives] = useState([]);
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);

  // const API_BASE_URL = "${BASE_URL}";
  // const AUTH_TOKEN = "Bearer RnPRz2AhXvnFIrbcRZKpJqA8aqMAP_JEraLesGnu43Q";

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setter(response.data);
      console.log("response:---", response.data);
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
    }
  };

  useEffect(() => {
    fetchData("get_property_types.json", (data) =>
      setProjectsType(data?.property_types || [])
    );
    fetchData("configuration_setups.json", (data) =>
      setConfigurations(data || [])
    );
    fetchData("specification_setups.json", (data) =>
      setSpecifications(data?.specification_setups || [])
    );
    fetchData("amenity_setups.json", (data) =>
      setAmenities(data?.amenities_setups || [])
    );
  }, []);

  useEffect(() => {
    const fetchCategoryTypes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}category_types.json`);

        if (response.data) {
          // Extract only category_type from each object
          const formattedCategories = response.data.map((item) => ({
            value: item.category_type, // Assign category_type as value
            label: item.category_type, // Assign category_type as label
          }));

          setCategoryTypes(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching category types:", error);
      }
    };

    fetchCategoryTypes();
  }, []);

  // console.log("data", projectsType);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}projects/${id}.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        const projectData = response.data;
        
        setFormData({
          Property_Type: projectData.property_type || "",
          SFDC_Project_Id: projectData.SFDC_Project_Id || "",
          building_type: projectData.building_type || "",
          Project_Construction_Status:
            projectData.Project_Construction_Status || "",
          Configuration_Type: Array.isArray(projectData.configurations)
            ? projectData.configurations.map((config) => config.name)
            : [],
          Project_Name: projectData.project_name || "",
          project_address: projectData.project_address || "",
          Project_Description: projectData.project_description || "",
          Price_Onward: projectData.price || "",
          Project_Size_Sq_Mtr: projectData.project_size_sq_mtr || "",
          Project_Size_Sq_Ft: projectData.project_size_sq_ft || "",
          development_area_sqmt: projectData.development_area_sqmt || "",
          development_area_sqft: projectData.development_area_sqft || "",
          Rera_Carpet_Area_Sq_M: projectData.rera_carpet_area_sq_mtr || "",
          Rera_Carpet_Area_sqft: projectData.rera_carpet_area_sqft || "",
          Rera_Sellable_Area: projectData.Rera_Sellable_Area || "",
          Number_Of_Towers: projectData.no_of_towers || "",
          no_of_floors: projectData.no_of_floors || "",
          Number_Of_Units: projectData.no_of_apartments || "",
          Rera_Number_multiple: projectData.rera_number_multiple || [],
          Amenities: Array.isArray(projectData.amenities)
            ? projectData.amenities.map((ammit) => ammit.name)
            : [],
          Specifications: Array.isArray(projectData.specifications)
            ? projectData.specifications.map((spac) => spac.name)
            : [],
          Land_Area: projectData.land_area || "",
          land_uom: projectData.land_uom || "",
          project_tag: projectData.project_tag || "",
          virtual_tour_url_multiple:
            projectData.virtual_tour_url_multiple || [],
          map_url: projectData.map_url || "",
          image: projectData.image_url || [],
          Address: {
            address_line_1: projectData.Address?.address || "",
            address_line_2: projectData.Address?.address_line_two || "",
            city: projectData.Address?.city || "",
            state: projectData.Address?.state || "",
            pin_code: projectData.Address?.pin_code || "",
            country: projectData.Address?.country || "",
          },
          ProjectBrochure: Array.isArray(projectData.ProjectBrochure)
            ? projectData.ProjectBrochure
            : projectData.ProjectBrochure
            ? [projectData.ProjectBrochure]
            : [],
          two_d_images: projectData.two_d_images || [],
          videos: projectData.videos || [],
          fetched_gallery_image: projectData.gallery_image || [],

        });

        setProject(response.data);
      } catch (err) {
        setError("Failed to fetch project details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, []);

  const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_BROCHURE_SIZE = 20 * 1024 * 1024; // 20MB

  // Format file size to human-readable format
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    else if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  // Function to check file size
  const isFileSizeValid = (file, maxSize) => {
    if (file.size > maxSize) {
      return {
        valid: false,
        name: file.name,
        size: formatFileSize(file.size),
      };
    }
    return { valid: true };
  };

  // console.log("this is the form data", formData);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (type === "file") {
      if (name === "brochure") {
        const file = files[0];
        const sizeCheck = isFileSizeValid(file, MAX_BROCHURE_SIZE);

        if (!sizeCheck.valid) {
          toast.error(
            `Brochure file too large: ${sizeCheck.name} (${
              sizeCheck.size
            }). Maximum allowed size is ${formatFileSize(MAX_BROCHURE_SIZE)}.`
          );
          e.target.value = ""; // Reset input
          return;
        }

        setFormData((prev) => ({
          ...prev,
          ProjectBrochure: [...(prev.ProjectBrochure || []), file],
        }));
      } else if (name === "two_d_images") {
        const newImages = Array.from(files);
        const validImages = [];
        const tooLargeFiles = [];

        newImages.forEach((file) => {
          const sizeCheck = isFileSizeValid(file, MAX_IMAGE_SIZE);
          if (!sizeCheck.valid) {
            tooLargeFiles.push(sizeCheck);
          } else {
            validImages.push(file);
          }
        });

        if (tooLargeFiles.length > 0) {
          const fileList = tooLargeFiles
            .map((f) => `${f.name} (${f.size})`)
            .join(", ");
          toast.error(
            `Image file(s) too large: ${fileList}. Maximum allowed size is ${formatFileSize(
              MAX_IMAGE_SIZE
            )} per file.`,
            {
              duration: 5000,
            }
          );

          if (tooLargeFiles.length === newImages.length) {
            e.target.value = ""; // Reset input if all files are invalid
            return;
          }
        }

        if (validImages.length > 0) {
          setFormData((prev) => ({
            ...prev,
            two_d_images: [...prev.two_d_images, ...validImages],
          }));
        }
      } else if (name === "videos") {
        const newVideos = Array.from(files);
        const validVideos = [];
        const tooLargeFiles = [];

        newVideos.forEach((file) => {
          const sizeCheck = isFileSizeValid(file, MAX_VIDEO_SIZE);
          if (!sizeCheck.valid) {
            tooLargeFiles.push(sizeCheck);
          } else {
            validVideos.push(file);
          }
        });

        if (tooLargeFiles.length > 0) {
          const fileList = tooLargeFiles
            .map((f) => `${f.name} (${f.size})`)
            .join(", ");
          toast.error(
            `Video file(s) too large: ${fileList}. Maximum allowed size is ${formatFileSize(
              MAX_VIDEO_SIZE
            )} per file.`,
            {
              duration: 5000,
            }
          );

          if (tooLargeFiles.length === newVideos.length) {
            e.target.value = ""; // Reset input if all files are invalid
            return;
          }
        }

        if (validVideos.length > 0) {
          setFormData((prev) => ({
            ...prev,
            videos: [...prev.videos, ...validVideos],
          }));
        }
      } else if (name === "image") {
        const files = Array.from(e.target.files);
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];

        // First check file type
        const validTypeFiles = files.filter((file) =>
          allowedTypes.includes(file.type)
        );

        if (validTypeFiles.length !== files.length) {
          toast.error("Only image files (JPG, PNG, GIF, WebP) are allowed.");
          e.target.value = "";
          return;
        }

        // Then check file size
        const file = validTypeFiles[0];
        const sizeCheck = isFileSizeValid(file, MAX_IMAGE_SIZE);

        if (!sizeCheck.valid) {
          toast.error(
            `Image file too large: ${sizeCheck.name} (${
              sizeCheck.size
            }). Maximum allowed size is ${formatFileSize(MAX_IMAGE_SIZE)}.`
          );
          e.target.value = ""; // Reset input
          return;
        }

        setFormData((prevFormData) => ({
          ...prevFormData,
          image: file,
        }));
      }
    } else {
      if (
        [
          "address_line_1",
          "address_line_2",
          "city",
          "state",
          "pin_code",
          "country",
        ].includes(name)
      ) {
        setFormData((prev) => ({
          ...prev,
          Address: {
            ...prev.Address,
            [name]: value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const handleFileChange = (e, fieldName) => {
    if (fieldName === "image") {
      const files = Array.from(e.target.files);
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      const validTypeFiles = files.filter((file) =>
        allowedTypes.includes(file.type)
      );

      if (validTypeFiles.length !== files.length) {
        toast.error("Only image files (JPG, PNG, GIF, WebP) are allowed.");
        e.target.value = "";
        return;
      }

      // Check file size
      const file = validTypeFiles[0];
      const sizeCheck = isFileSizeValid(file, MAX_IMAGE_SIZE);

      if (!sizeCheck.valid) {
        toast.error(
          `Image file too large: ${sizeCheck.name} (${
            sizeCheck.size
          }). Maximum allowed size is ${formatFileSize(MAX_IMAGE_SIZE)}.`
        );
        e.target.value = ""; // Reset input
        return;
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        image: file,
      }));
    }
  };
  const handleDiscardTwoDImage = async (key, index) => {
    const image = formData[key][index]; // Get the selected image
    if (!image.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}projects/${id}/remove_twoD_image/${image.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      console.log(`Image with ID ${image.id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleDiscardFile = (fileType, index) => {
    if (fileType === "brochure") {
      if (index !== undefined) {
        // Remove specific brochure by index
        const updatedBrochures = [...formData.ProjectBrochure];
        updatedBrochures.splice(index, 1);
        setFormData({ ...formData, ProjectBrochure: updatedBrochures });
      } else {
        // Clear all brochures if no index specified
        setFormData({ ...formData, ProjectBrochure: [] });
      }
    } else if (fileType === "gallery_image") {
      const updatedGallery = [...formData.gallery_image];
      updatedGallery.splice(index, 1);
      setFormData({ ...formData, gallery_image: updatedGallery });
    }
  };

  const handleImageNameChange = (e, index) => {
    const { value } = e.target;

    setFormData((prev) => {
      const updatedGallery = [...prev.gallery_image];
      updatedGallery[index].gallery_image_file_name = value;

      return { ...prev, gallery_image: updatedGallery };
    });
  };
  const handleFetchedDiscardGallery = async (key, index, imageId) => {
    if (!imageId) {
      console.error("Error: No image ID found for deletion.");
      toast.error("Failed to delete image. Image ID is missing.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${BASE_URL}projects/${id}/remove_gallery_image/${imageId}.json`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete image. Server response:`);
      }

      // Update state to remove the deleted image
      setFormData((prev) => ({
        ...prev,
        [key]: prev[key].filter((_, i) => i !== index),
      }));

      toast.success("Image deleted successfully!");
      console.log(`Image with ID ${imageId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting image:", error.message);
      toast.error("Failed to delete image. Please try again.");
    }
  };

  const handleFileDiscard = async (key, index) => {
    const videos = formData[key][index]; // Get the selected image
    if (!videos.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}projects/${id}/remove_videos/${videos.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete videos");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      console.log(`Image with ID ${videos.id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleFileDiscardCreative = async (key, index) => {
    const Image = formData[key][index]; // Get the selected image
    if (!Image.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}projects/${id}/remove_creative_image/${Image.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete videos");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      console.log(`Image with ID ${Image.id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleFileDiscardCreativeGenerics = async (key, index) => {
    const Image = formData[key][index]; // Get the selected image
    if (!Image.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}projects/${id}/remove_creative_generics_image/${Image.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete videos");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      console.log(`Image with ID ${Image.id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleFileDiscardCreativeOffers = async (key, index) => {
    const Image = formData[key][index]; // Get the selected image
    if (!Image.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}projects/${id}/remove_creative_offers_image/${Image.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete videos");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      console.log(`Image with ID ${Image.id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleFileDiscardInteriors = async (key, index) => {
    const Image = formData[key][index]; // Get the selected image
    if (!Image.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}projects/${id}/remove_ineteriors_image/${Image.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete videos");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      console.log(`Image with ID ${Image.id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleFileDiscardExteriors = async (key, index) => {
    const Image = formData[key][index]; // Get the selected image
    if (!Image.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}projects/${id}/remove_exterios_image/${Image.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete videos");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      console.log(`Image with ID ${Image.id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleFileDiscardLayout = async (key, index) => {
    const Image = formData[key][index]; // Get the selected image
    if (!Image.id) {
      // If the image has no ID, it's a newly uploaded file. Just remove it locally.
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });
      toast.success("Image removed successfully!");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}projects/${id}/remove_layout_image/${Image.id}.json`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete videos");
      }

      // Remove the deleted image from the state
      const updatedFiles = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedFiles });

      console.log(`Image with ID ${Image.id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const validateForm = (formData) => {
    const errors = [];

    if (!formData.Property_Type) {
      errors.push("Project Type is required.");
      return errors;
    }
    if (!formData.building_type) {
      errors.push("Building Type is required.");
      return errors;
    }
    if (!formData.Project_Construction_Status) {
      errors.push("Construction Status is required.");
      return errors;
    }
    if (!formData.Configuration_Type.length) {
      errors.push("Configuration Type is required.");
      return errors;
    }
    if (!formData.Project_Name) {
      errors.push("Project Name is required.");
      return errors;
    }
    if (!formData.project_address) {
      errors.push("Location is required.");
      return errors;
    }
    if (!formData.Project_Description) {
      errors.push("Project Description is required.");
      return errors;
    }
    if (!formData.Price_Onward) {
      errors.push("Price Onward is required.");
      return errors;
    }
    if (!formData.Rera_Carpet_Area_Sq_M) {
      errors.push("RERA Carpet Area (Sq. M) is required.");
      return errors;
    }
    if (!formData.Rera_Carpet_Area_sqft) {
      errors.push("RERA Carpet Area (Sq. Ft.) is required.");
      return errors;
    }
    if (!formData.Number_Of_Towers) {
      errors.push("Number of Towers is required.");
      return errors;
    }
    if (!formData.Number_Of_Units) {
      errors.push("Number of Units is required.");
      return errors;
    }
    if (!formData.Land_Area) {
      errors.push("Land Area is required.");
      return errors;
    }
    if (!formData.Address || !formData.Address.address_line_1) {
      errors.push("Address Line 1 is required.");
      return errors;
    }
    // if (!formData.Address || !formData.Address.address_line_2) {
    //   errors.push("Address Line 2 is required.");
    //   return errors;
    // }
    if (!formData.Address || !formData.Address.city) {
      errors.push("City is required.");
      return errors;
    }
    if (!formData.Address || !formData.Address.state) {
      errors.push("State is required.");
      return errors;
    }
    if (!formData.Address || !formData.Address.pin_code) {
      errors.push("Pin Code is required.");
      return errors;
    }
    if (!formData.Address || !formData.Address.country) {
      errors.push("Country is required.");
      return errors;
    }
    if (!formData.ProjectBrochure) {
      errors.push("Brochure is required.");
      return errors;
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors = validateForm(formData);
    if (validationErrors.length > 0) {
      console.log("Validation errors:", validationErrors);

      toast.error(validationErrors[0]);
      setLoading(false);
      return;
    }
    const data = new FormData();

    // Append text fields
    data.append("project[Property_Type]", formData.Property_Type || "");
    data.append("project[building_type]", formData.building_type || "");
    data.append("project[SFDC_Project_Id]", formData.SFDC_Project_Id || "");
    data.append(
      "project[Project_Construction_Status]",
      formData.Project_Construction_Status || ""
    );
    data.append("project[Project_Name]", formData.Project_Name || "");
    data.append("project[project_address]", formData.project_address || "");
    data.append(
      "project[Project_Description]",
      formData.Project_Description || ""
    );
    data.append("project[Price_Onward]", formData.Price_Onward || "");
    data.append(
      "project[Project_Size_Sq_Mtr]",
      formData.Project_Size_Sq_Mtr || ""
    );
    data.append(
      "project[Project_Size_Sq_Ft]",
      formData.Project_Size_Sq_Ft || ""
    );
    data.append(
      "project[development_area_sqft]",
      formData.development_area_sqft || ""
    );
    data.append(
      "project[development_area_sqmt]",
      formData.development_area_sqmt || ""
    );
    data.append(
      "project[Rera_Carpet_Area_Sq_M]",
      formData.Rera_Carpet_Area_Sq_M || ""
    );
    data.append(
      "project[Rera_Carpet_Area_sqft]",
      formData.Rera_Carpet_Area_sqft || ""
    );
    data.append(
      "project[Rera_Sellable_Area]",
      formData.Rera_Sellable_Area || ""
    );
    data.append("project[Number_Of_Towers]", formData.Number_Of_Towers || "");
    data.append("project[Number_Of_Units]", formData.Number_Of_Units || "");
    data.append("project[no_of_floors]", formData.no_of_floors || "");
    data.append("project[Land_Area]", formData.Land_Area || "");
    data.append("project[land_uom]", formData.land_uom || "");
    data.append("project[project_tag]", formData.project_tag || "");
    data.append("project[map_url]", formData.map_url || "");

    // Append array fields (as comma-separated strings)
    data.append(
      "project[Configuration_Type]",
      (formData.Configuration_Type || []).join(",")
    );
    data.append("project[Amenities]", (formData.Amenities || []).join(","));
    data.append(
      "project[Specifications]",
      (formData.Specifications || []).join(",")
    );

    // Append Address fields
    if (formData.Address) {
      Object.entries(formData.Address).forEach(
        ([addressKey, addressValue]) => {
          data.append(`project[Address][${addressKey}]`, addressValue || "");
        }
      );
    }

    // Append RERA numbers
    if (Array.isArray(formData.Rera_Number_multiple)) {
      formData.Rera_Number_multiple.forEach((item, index) => {
        if (item.tower_name && item.rera_number) {
          data.append(
            `project[Rera_Number_multiple][${index}][tower_name]`,
            item.tower_name
          );
          data.append(
            `project[Rera_Number_multiple][${index}][rera_number]`,
            item.rera_number
          );
        }
      });
    }

    // Append main image if it's a new file
    if (formData.image instanceof File) {
      data.append("project[image]", formData.image, formData.image.name);
    }

    // Append new gallery images
    if (Array.isArray(formData.gallery_image)) {
      formData.gallery_image.forEach((fileObj) => {
        if (fileObj.gallery_image instanceof File) {
          data.append(
            "project[gallery_image][]",
            fileObj.gallery_image,
            fileObj.gallery_image_file_name
          );
        }
      });
    }

    // Append new brochures
    if (Array.isArray(formData.ProjectBrochure)) {
      formData.ProjectBrochure.forEach((file) => {
        if (file instanceof File) {
          data.append("project[ProjectBrochure][]", file, file.name);
        }
      });
    }

    console.log("Submitting FormData:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axios.put(`${BASE_URL}projects/${id}.json`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // 'Content-Type': 'multipart/form-data' is automatically set by the browser for FormData
        },
      });

      console.log(response.data);
      toast.success("Project updated successfully");
      navigate("/project-list");
    } catch (error) {
      console.error("Error updating the project:", error);
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        const messages = Object.values(error.response.data)
          .flat()
          .join("\n");
        toast.error(
          `Failed to update project: ${
            messages || "Please check your input."
          }`
        );
      } else {
        toast.error("Failed to update the project. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const imageURL = URL.createObjectURL(files[0]); // Generate a preview URL

      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0], // Store the actual file for submission
        previewImage: imageURL, // Store preview URL for display
      }));
    }
  };

  const statusOptions = {
    "Office Parks": [
      { value: "Completed", label: "Completed" },
      { value: "Under-Construction", label: "Under Construction" },
    ],
    Residential: [
      { value: "Completed", label: "Completed" },
      { value: "Ready-To-Move-in", label: "Ready To Move in" },
    ],
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleCancel = () => {
    navigate(-1);
  };

  const handleTowerChange = (e) => {
    setTowerName(e.target.value);
  };

  const handleReraNumberChange = (e) => {
    setReraNumber(e.target.value);
  };

  const handleAddRera = () => {
    if (!towerName || !reraNumber) {
      toast.error("Both fields are required.");
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      Rera_Number_multiple: [
        ...prevData.Rera_Number_multiple,
        { tower_name: towerName, rera_number: reraNumber },
      ],
    }));

    // Clear input fields after adding
    setTowerName("");
    setReraNumber("");
  };

  // Handles editing existing RERA entries
  const handleEditRera = (index, field, value) => {
    setFormData((prevData) => {
      const updatedRera = [...prevData.Rera_Number_multiple];
      updatedRera[index][field] = value; // Update the correct field
      return { ...prevData, Rera_Number_multiple: updatedRera };
    });
  };

  // Handles deleting an entry
  const handleDeleteRera = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      Rera_Number_multiple: prevData.Rera_Number_multiple.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleVirtualTourChange = (e) => {
    setVirtualTourUrl(e.target.value);
  };

  const handleVirtualTourNameChange = (e) => {
    setVirtualTourName(e.target.value);
  };

  const handleAddVirtualTour = () => {
    if (!virtualTourName || !virtualTourUrl) {
      alert("Please enter both Tour Name and URL.");
      return;
    }

    setFormData((prev) => {
      console.log("Previous state:", prev); // Debugging
      return {
        ...prev,
        virtual_tour_url_multiple: [
          ...(Array.isArray(prev.virtual_tour_url_multiple)
            ? prev.virtual_tour_url_multiple
            : []),
          {
            virtual_tour_name: virtualTourName,
            virtual_tour_url: virtualTourUrl,
          },
        ],
      };
    });

    // Clear input fields after adding
    setVirtualTourName("");
    setVirtualTourUrl("");
  };

  const handleEditVirtualTour = (index, field, value) => {
    setFormData((prevData) => {
      const updatedTours = [...prevData.virtual_tour_url_multiple]; // Create a new array
      updatedTours[index] = { ...updatedTours[index], [field]: value }; // Update specific entry

      return {
        ...prevData,
        virtual_tour_url_multiple: updatedTours, // Update state immutably
      };
    });
  };

  const handleDeleteVirtualTour = (index) => {
    setFormData((prev) => ({
      ...prev,
      virtual_tour_url_multiple: prev.virtual_tour_url_multiple.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const amenityTypes = [
    ...new Set(amenities.map((ammit) => ammit.amenity_type)),
  ].map((type) => ({ value: type, label: type }));

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    const updatedImages = files.map((file) => ({
      gallery_image: file, // ✅ Store the actual File object
      gallery_image_file_name: file.name,
      gallery_image_file_type: selectedCategory,
      attachfile: { document_url: URL.createObjectURL(file) }, // ✅ Add temporary URL
    }));

    setFormData((prev) => ({
      ...prev,
      gallery_image: [...(prev.gallery_image || []), ...updatedImages], // ✅ Preserve previous images
    }));

    event.target.value = ""; // Reset file input
  };

  const handleGalleryImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const newFiles = files.map((file) => ({
      id: null, // No ID for new uploads
      document_file_name: file.name,
      document_content_type: file.type,
      document_url: URL.createObjectURL(file), // Temporary preview
      file, // Store the actual file for upload later
    }));
    setFormData((prev) => ({
      ...prev,
      gallery_image: [...prev.gallery_image, ...files], // Append new images
    }));
  };

  const handleDiscardGallery = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery_image: prev.gallery_image.filter((_, i) => i !== index),
    }));
  };

  const handleDiscardPpt = (key, index) => {
    setFormData((prev) => {
      if (!prev[key] || !Array.isArray(prev[key])) return prev; // Ensure key exists and is an array

      const updatedFiles = prev[key].filter((_, i) => i !== index);

      console.log(`Updated ${key} after deletion:`, updatedFiles); // Debugging log

      return { ...prev, [key]: updatedFiles };
    });
  };

  const MAX_PPT_SIZE = 10 * 1024 * 1024; // 10MB

  // Modify the handleFileUpload function to handle gallery_images
  const handleFileUpload = (name, files) => {
    const MAX_SIZES = {
      brochure: MAX_BROCHURE_SIZE,
      image: MAX_IMAGE_SIZE,
      gallery_image: MAX_IMAGE_SIZE,
    };

    const allowedTypes = {
      image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      gallery_image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      brochure: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    };

    if (!files || !files.length) return;

    if (name === "brochure") {
      // Handle multiple brochure files
      const newFiles = Array.from(files);
      const validFiles = [];

      newFiles.forEach((file) => {
        if (!allowedTypes.brochure.includes(file.type)) {
          toast.error("Only PDF and DOCX files are allowed for brochure.");
          return;
        }

        if (!validateFile(file, MAX_SIZES[name])) return;
        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        setFormData((prev) => ({
          ...prev,
          brochure: [...prev.brochure, ...validFiles],
        }));
      }
    } else if (name === "gallery_image") {
      // Handle multiple files for images, videos, gallery
      const newFiles = Array.from(files);
      const validFiles = [];
      const tooLargeFiles = [];

      newFiles.forEach((file) => {
        // Check file type if there are allowed types specified
        if (allowedTypes[name] && !allowedTypes[name].includes(file.type)) {
          const fileType = name === "videos" ? "video" : "image";
          toast.error(
            `Only supported ${fileType} formats are allowed for ${name.replace(
              "_",
              " "
            )}.`
          );
          return;
        }

        const sizeCheck = isFileSizeValid(file, MAX_SIZES[name]);
        if (!sizeCheck.valid) {
          tooLargeFiles.push(sizeCheck);
          return;
        }

        validFiles.push(file);
      });

      if (tooLargeFiles.length > 0) {
        tooLargeFiles.forEach((file) => {
          toast.error(
            `File too large: ${file.name} (${
              file.size
            }). Max size: ${formatFileSize(MAX_SIZES[name])}`
          );
        });
      }

      if (validFiles.length > 0) {
        setFormData((prev) => ({
          ...prev,
          [name]: [...(prev[name] || []), ...validFiles],
        }));
      }
    } else if (name === "image") {
      // Handle single image
      const file = files[0];
      if (!allowedTypes.image.includes(file.type)) {
        toast.error("Only JPG, PNG, GIF, and WebP images are allowed.");
        return;
      }

      const sizeCheck = isFileSizeValid(file, MAX_SIZES.image);
      if (!sizeCheck.valid) {
        toast.error(
          `File too large: ${sizeCheck.name} (${
            sizeCheck.size
          }). Max size: ${formatFileSize(MAX_SIZES.image)}`
        );
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  // const handleFetchedDiscardPPT = (index, id) => {
  //   setFormData((prev) => {
  //     const updatedPPT = prev.fetched_Project_PPT.filter(
  //       (file) => file.id !== id
  //     );
  //     return { ...prev, fetched_Project_PPT: updatedPPT };
  //   });
  // };

  const propertyTypeOptions = [
    { value: "Office Parks", label: "Office Parks" },
    { value: "Residential", label: "Residential" },
  ];

  const buildingTypeOptions = {
    "Office Parks": [
      { value: "Mixed-Use-Development", label: "Mixed Use Development" },
      { value: "Special-Economic-Zone", label: "Special Economic Zone" },
      { value: "Tech-Parks", label: "Tech Parks" },
      { value: "Built-to-Suit", label: "Built to Suit" },
      { value: "Upcoming-Developments", label: "Upcoming Developments" },
    ],
    Residential: [
      { value: "Completed", label: "Completed" },
      { value: "Ready-To-Move-In", label: "Ready To Move In" },
      { value: "Upcoming-Developments", label: "Upcoming Developments" },
    ],
  };

  return (
    <>
      {/* <Header /> */}

      <div className="module-data-section p-3">
        <div className="card mt-4 pb-4 mx-4">
          <div className="card-header">
            <h3 className="card-title">Edit Project</h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Project Banner Image
                    <span
                      className="tooltip-container"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      [i]
                      {showTooltip && (
                        <span className="tooltip-text">
                          Max Upload Size 50 MB
                        </span>
                      )}
                    </span>
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    name="image"
                    accept="image/*"
                    required={!(formData.previewImage || formData.image)}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Show selected or previously uploaded image */}
                {formData.previewImage || formData.image ? (
                  <img
                    src={formData.previewImage || formData.image} // Show updated image first
                    alt="Uploaded Preview"
                    className="img-fluid rounded mt-2"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      objectFit: "cover",
                      marginBottom: "15px",
                    }}
                  />
                ) : (
                  <span>No image selected</span>
                )}
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Project Types
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <SelectBox
                    options={[
                      //{ value: "", label: "Select status", isDisabled: true },
                      { value: "Office Parks", label: "Office Parks" },
                      { value: "Residential", label: "Residential" },
                    ]}
                    defaultValue={formData.Property_Type}
                    onChange={(selectedValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        Property_Type: selectedValue,
                      }))
                    }
                    //isDisableFirstOption={true}
                  />
                </div>
              </div>

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Project Building Type
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <SelectBox
                    options={buildingTypeOptions[formData.Property_Type] || []} // ✅ Show correct options
                    defaultValue={formData.building_type}
                    onChange={(selectedValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        building_type: selectedValue,
                      }))
                    }
                    isDisabled={!formData.Property_Type} // ✅ Disable if no Property_Type selected
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Project Construction Status
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <SelectBox
                    options={statusOptions[formData.Property_Type] || []}
                    defaultValue={formData.Project_Construction_Status}
                    onChange={(selectedValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        Project_Construction_Status: selectedValue,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Configuration Type
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <MultiSelectBox
                    options={configurations.map((config) => ({
                      value: config.name,
                      label: config.name,
                    }))}
                    value={formData.Configuration_Type.map((type) => ({
                      value: type,
                      label: type,
                    }))}
                    onChange={(selectedOptions) =>
                      setFormData((prev) => ({
                        ...prev,
                        Configuration_Type: selectedOptions.map(
                          (option) => option.value
                        ),
                      }))
                    }
                    placeholder="Select Type"
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Project Name
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="Project_Name"
                    value={formData.Project_Name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Location
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Default input"
                    name="project_address"
                    value={formData.project_address}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>Project Tag</label>
                  <SelectBox
                    options={[
                      //{ value: "", label: "Select status", isDisabled: true },
                      { value: "Featured", label: "Featured" },
                      { value: "Upcoming", label: "Upcoming" },
                    ]}
                    defaultValue={formData.project_tag}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        project_tag: value,
                      }))
                    }
                    // isDisableFirstOption={true}
                  />
                </div>
              </div>
              <div className="col-md-6 mt-2">
                <div className="form-group">
                  <label>
                    Project Description
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={1}
                    placeholder="Enter ..."
                    name="Project_Description"
                    value={formData.Project_Description}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Price Onward
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>

                  <input
                    className="form-control"
                    type="text-number"
                    placeholder="Default input"
                    name="Price_Onward"
                    value={formData.Price_Onward}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Project Size (Sq. Mtr.) (For Residential)
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Default input"
                    name="Project_Size_Sq_Mtr"
                    value={formData.Project_Size_Sq_Mtr}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Project Size (Sq. Ft.) (For Residential)
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Default input"
                    name="Project_Size_Sq_Ft"
                    value={formData.Project_Size_Sq_Ft}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Development Area (Sq. Mtr.) (For Office Park)
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="development_area_sqmt"
                    placeholder="Enter Area Sq. Mt."
                    value={formData.development_area_sqmt}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Development Area (Sq. Ft.) (For Office Park)
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span> */}
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="development_area_sqft"
                    placeholder="Enter Area in Sq. Ft."
                    value={formData.development_area_sqft}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Rera Carpet Area (Sq. M)
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Default input"
                    name="Rera_Carpet_Area_Sq_M"
                    value={formData.Rera_Carpet_Area_Sq_M}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Rare Carpet Area (Sq. Ft.)
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Default input"
                    name="Rera_Carpet_Area_sqft"
                    value={formData.Rera_Carpet_Area_sqft}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Rare Sellable Area
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="text-number"
                    placeholder="Default input"
                    name="Rera_Sellable_Area"
                    value={formData.Rera_Sellable_Area}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Number of Towers
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Default input"
                    name="Number_Of_Towers"
                    value={formData.Number_Of_Towers}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Number of Floors
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="no_of_floors"
                    placeholder="Enter Number of Floors"
                    value={formData.no_of_floors}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Number of Units
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Default input"
                    name="Number_Of_Units"
                    value={formData.Number_Of_Units}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Land Area (Acres)
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Default input"
                    name="Land_Area"
                    value={formData.Land_Area}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Land UOM
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <SelectBox
                    options={[
                      { value: "Square Meter", label: "Square Meter" },
                      {
                        value: "Square Feet",
                        label: "Square Feet",
                      },
                      {
                        value: "Acre",
                        label: "Acre",
                      },
                      { value: "Hectare", label: "Hectare" },
                      { value: "Yard", label: "Yard" },
                      {
                        value: "Guntha",
                        label: "Guntha",
                      },
                      { value: "Bigha", label: "Bigha" },
                      { value: "Kanal", label: "Kanal" },
                      { value: "Marla", label: "Marla" },
                      { value: "Cent", label: "Cent" },
                      { value: "Ropani", label: "Ropani" },
                    ]}
                    defaultValue={formData.land_uom}
                    onChange={(selectedOption) =>
                      setFormData((prev) => ({
                        ...prev,
                        land_uom: selectedOption,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card mt-3 pb-4 mx-4">
  <div className="card-header d-flex justify-content-between align-items-center ">
    <h3 className="card-title">RERA Number</h3>
  </div>
  <div className="card-body mt-0 pb-0">
    <div className="row align-items-center">
      <div className="col-md-3 mt-2">
        <button
          className="purple-btn2 rounded-3"
          style={{ marginTop: "10px" }}
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              Rera_Number_multiple: [
                ...prev.Rera_Number_multiple,
                { tower_name: "", rera_number: "" },
              ],
            }))
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={26}
            height={20}
            fill="currentColor"
            className="bi bi-plus"
            viewBox="0 0 16 16"
          >
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
          </svg>
          <span> Add</span>
        </button>
      </div>
    </div>
    <div className="col-md-12 mt-2">
      <div className="mt-4 tbl-container w-100">
        <table className="w-100">
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Tower Name</th>
              <th>RERA Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.Rera_Number_multiple.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={item.tower_name}
                    onChange={e => {
                      const updated = [...formData.Rera_Number_multiple];
                      updated[index].tower_name = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        Rera_Number_multiple: updated,
                      }));
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={item.rera_number}
                    onChange={e => {
                      const updated = [...formData.Rera_Number_multiple];
                      updated[index].rera_number = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        Rera_Number_multiple: updated,
                      }));
                    }}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="purple-btn2"
                    onClick={() => {
                      if (formData.Rera_Number_multiple.length > 1) {
                        setFormData(prev => ({
                          ...prev,
                          Rera_Number_multiple: prev.Rera_Number_multiple.filter((_, i) => i !== index),
                        }));
                      }
                    }}
                    disabled={formData.Rera_Number_multiple.length === 1}
                  >
                    x
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

        <div className="card mt-3 pb-4 mx-4">
          <div className="card-header">
            <h3 className="card-title">Amenities</h3>
          </div>
          <div className="card-body mt-0 pb-0">
            <div className="row">
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Amenities
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <MultiSelectBox
                    options={amenities.map((ammit) => ({
                      value: ammit.name,
                      label: ammit.name,
                    }))}
                    value={formData.Amenities.map((amenitie) => ({
                      value: amenitie,
                      label: amenitie,
                    }))}
                    onChange={(selectedOptions) =>
                      setFormData((prev) => ({
                        ...prev,
                        Amenities: selectedOptions.map(
                          (option) => option.value
                        ),
                      }))
                    }
                    placeholder="Select Amenities"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card mt-3 pb-4 mx-4">
          <div className="card-header">
            <h3 className="card-title">Address</h3>
          </div>
          <div className="card-body">
            <div className="row">
              {/* Address Section */}
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Address Line 1{" "}
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>{" "}
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Address Line 1"
                    name="address_line_1"
                    value={formData.Address.address_line_1}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Address Line 2
                    {/* <span style={{ color: "red", fontSize: "16px" }}>*</span>{" "} */}
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Address Line 2"
                    name="address_line_2"
                    value={formData.Address.address_line_2}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* City, State, Pin, Country Section */}
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    City
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="City"
                    name="city"
                    value={formData.Address.city}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    State
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="State"
                    name="state"
                    value={formData.Address.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Pin Code
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Pin Code"
                    name="pin_code"
                    value={formData.Address.pin_code}
                    maxLength={6} // Restricts input to 6 characters
                    onChange={(e) => {
                      const { name, value } = e.target;
                      // Allow only numbers and ensure max 6 digits
                      if (/^\d*$/.test(value) && value.length <= 6) {
                        setFormData((prevData) => ({
                          ...prevData,
                          Address: { ...prevData.Address, [name]: value },
                        }));
                      }
                    }}
                    onBlur={(e) => {
                      const { name, value } = e.target;
                      if (value.length !== 6) {
                        toast.error("Pin Code must be exactly 6 digits");
                        setFormData((prevData) => ({
                          ...prevData,
                          Address: { ...prevData.Address, [name]: "" }, // Reset field on incorrect input
                        }));
                      }
                    }}
                  />
                </div>
              </div>

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Country
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Country"
                    name="country"
                    value={formData.Address.country}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Map URL
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="map_url"
                    placeholder="Enter Location"
                    value={formData.map_url}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card mt-3 pb-4 mx-4">
          <div className="card-header">
            <h3 className="card-title">
              File Upload
              <span style={{ color: "#de7008", fontSize: "16px" }}> *</span>
            </h3>
          </div>
          <div className="card-body">
            <div className="row">
              {/* Gallery Section */}
              <div className="d-flex justify-content-between align-items-end mx-1">
                <h5 className="mt-3">
                  Gallery Images{" "}
                  <span
                    className="tooltip-container"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    [i]
                    {showTooltip && (
                      <span className="tooltip-text">
                        Max Upload Size 10 MB
                      </span>
                    )}
                  </span>
                  <span style={{ color: "#de7008", fontSize: "16px" }}> *</span>
                </h5>

                {/* Category Dropdown and Add Button in one row */}
                <div className="d-flex align-items-center">
                  {/* <div className="me-2">
                    <SelectBox
                      options={categoryTypes}
                      defaultValue={selectedCategory}
                      onChange={(value) => setSelectedCategory(value)}
                    />
                  </div> */}

                  {/* Add Button */}
                  <button
                    className="purple-btn2 rounded-3"
                    onClick={() =>
                      document.getElementById("gallery_image").click()
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      fill="currentColor"
                      className="bi bi-plus"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                    </svg>
                    <span>Add</span>
                  </button>
                </div>

                <input
                  id="gallery_image"
                  type="file"
                  accept="image/*"
                  name="gallery_image"
                  onChange={handleImageUpload}
                  multiple
                  style={{ display: "none" }}
                />
              </div>

              {/* Main Section */}
              <div className="col-md-12 mt-2">
                <div
                  className="mt-4 tbl-container"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  <table className="w-100">
                    <thead>
                      <tr>
                        {/* <th>Image Category</th> */}
                        <th>Image Name</th>
                        <th>Image</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* First render API fetched images */}
                      {formData.fetched_gallery_image?.map((file, index) =>
                        file.attachfiles?.map((attachment, idx) => (
                          <tr key={`fetched-${index}-${idx}`}>
                            {/* <td>{file.gallery_type || "N/A"}</td> */}
                            <td>{attachment.document_file_name || "N/A"}</td>
                            <td>
                              {attachment.document_url && (
                                <img
                                  style={{ maxWidth: 100, maxHeight: 100 }}
                                  className="img-fluid rounded"
                                  src={attachment.document_url}
                                  alt={attachment.file_name || "Fetched Image"}
                                />
                              )}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="purple-btn2"
                                onClick={() =>
                                  handleFetchedDiscardGallery(
                                    "gallery_image",
                                    index,
                                    attachment.id
                                  )
                                }
                              >
                                x
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                      {/* Then render newly added images */}
                      {(formData.gallery_image ?? []).map((file, index) => (
                        <tr key={`new-${index}`}>
                          {/* <td>{file.gallery_image_file_type || "N/A"}</td> */}
                          <td>
                            <input
                              className="form-control"
                              type="text"
                              name="gallery_image_file_name"
                              placeholder="Enter Image Name"
                              value={file.gallery_image_file_name}
                              onChange={(e) => handleImageNameChange(e, index)}
                            />
                          </td>
                          <td>
                            {file.gallery_image && (
                              <img
                                style={{ maxWidth: 100, maxHeight: 100 }}
                                className="img-fluid rounded"
                                src={
                                  file.attachfile?.document_url ||
                                  URL.createObjectURL(file.gallery_image)
                                }
                                alt="Preview"
                              />
                            )}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="purple-btn2"
                              onClick={() => handleDiscardGallery(index)}
                            >
                              x
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-end mx-1">
                <h5 className="mt-3">
                  Brochure{" "}
                  <span
                    className="tooltip-container"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    [i]
                    {showTooltip && (
                      <span className="tooltip-text">
                        Max Upload Size 50 MB
                      </span>
                    )}
                  </span>
                  <span style={{ color: "#de7008", fontSize: "16px" }}> *</span>
                </h5>

                <button
                  className="purple-btn2 rounded-3"
                  onClick={() => document.getElementById("brochure").click()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={26}
                    height={20}
                    fill="currentColor"
                    className="bi bi-plus"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                  </svg>
                  <span>Add</span>
                </button>

                <input
                  id="brochure"
                  className="form-control"
                  type="file"
                  name="brochure"
                  accept=".pdf,.docx"
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
              </div>

              <div className="col-md-12 mt-2">
                <div className="mt-4 tbl-container w-100">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.ProjectBrochure &&
                      formData.ProjectBrochure.length > 0 ? (
                        formData.ProjectBrochure.map((brochure, index) => (
                          <tr key={index}>
                            <td>
                              {brochure.name ||
                                brochure.document_file_name ||
                                "No File"}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="purple-btn2"
                                onClick={() =>
                                  handleDiscardFile("brochure", index)
                                }
                              >
                                x
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2}>No brochure uploaded</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-2 justify-content-center">
          <div className="col-md-2">
            <button
              type="submit"
              className="purple-btn2 w-100"
              onClick={handleSubmit}
              disabled={loading}
            >
              Submit
            </button>
          </div>

          <div className="col-md-2">
            <button
              type="button"
              className="purple-btn2 w-100"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsEdit;
