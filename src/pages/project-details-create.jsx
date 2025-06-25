import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SelectBox from "../components/base/SelectBox";
import MultiSelectBox from "../components/base/MultiSelectBox";
import BASE_URL from "../Confi/baseurl";

const ProjectDetailsCreate = () => {
  const [formData, setFormData] = useState({
    Property_Type: [],
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
    gallery_image: [],
  });

  useEffect(() => {
    console.log("formData updated:", formData);
  }, [formData]);

  console.log("formD", formData);

  const [projectsType, setprojectsType] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [virtualTourUrl, setVirtualTourUrl] = useState("");
  const [virtualTourName, setVirtualTourName] = useState("");
  const [towerName, setTowerName] = useState("");
  const [reraNumber, setReraNumber] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [filteredAmenities, setFilteredAmenities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [projectCreatives, setProjectCreatives] = useState([]);
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [selectedCreativeType, setSelectedCreativeType] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const errorToastRef = useRef(null);
  const Navigate = useNavigate();

  const [reraList, setReraList] = useState([{ tower: "", reraNumber: "" }]);

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

  const amenityTypes = [
    ...new Set(amenities.map((ammit) => ammit.amenity_type)),
  ].map((type) => ({ value: type, label: type }));

  // Filter amenities based on selected type
  useEffect(() => {
    if (selectedType) {
      setFilteredAmenities(
        amenities.filter((ammit) => ammit.amenity_type === selectedType.value)
      );
    } else {
      setFilteredAmenities([]);
    }
  }, [selectedType, amenities]);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (type === "file") {
      handleFileUpload(name, files);
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
      } else if (name === "virtual_tour_url_multiple") {
        setVirtualTour(value); // Update temporary input state
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const handleProjectCreativesUpload = (files) => {
    if (!files || files.length === 0) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "video/mp4",
      "video/mov",
    ];

    const MAX_SIZE = 50 * 1024 * 1024; // 50MB max per file

    const newFiles = Array.from(files);
    const validFiles = [];

    newFiles.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}`);
        return;
      }

      if (file.size > MAX_SIZE) {
        toast.error(`File too large: ${file.name}. Max size is 50MB.`);
        return;
      }

      validFiles.push({ file, type: "" }); // Default type empty, user will select
    });

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        project_creatives: [...prev.project_creatives, ...validFiles],
      }));
    }
  };

  const MAX_PPT_SIZE = 10 * 1024 * 1024; // 10MB

  // Modify the handleFileUpload function to handle gallery_images
  const handleFileUpload = (name, files) => {
    const MAX_SIZES = {
      brochure: MAX_BROCHURE_SIZE,
      gallery_image: MAX_IMAGE_SIZE,
      image: MAX_IMAGE_SIZE,
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
      const newFiles = Array.from(files);
      const validFiles = [];
      console.log("New files for brochure:", newFiles);

      newFiles.forEach((file) => {
        if (!allowedTypes.brochure.includes(file.type)) {
          toast.error("Only PDF and DOCX files are allowed for brochure.");
          return;
        }

        if (!validateFile(file, MAX_SIZES[name])) return;
        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        console.log("Valid files for brochure:", validFiles);

        setFormData((prev) => ({
          ...prev,
          ProjectBrochure: [...prev.ProjectBrochure, ...validFiles],
        }));
      }
    } else if (
      name === "two_d_images" ||
      name === "videos" ||
      name === "gallery_image"
    ) {
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
  // Add this to your file:
  // File Validation
  const validateFile = (file, maxSize, tooLargeFiles = null) => {
    const sizeCheck = isFileSizeValid(file, maxSize);
    if (!sizeCheck.valid) {
      if (tooLargeFiles) {
        tooLargeFiles.push(sizeCheck);
      } else {
        toast.error(
          `File too large: ${sizeCheck.name} (${
            sizeCheck.size
          }). Max size: ${formatFileSize(maxSize)}`
        );
      }
      return false;
    }
    return true;
  };

  // 3. Update handleDiscardFile to handle gallery_images
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

  const validateForm = (formData) => {
    toast.dismiss();
    if (
      !formData.Rera_Number_multiple.length ||
      !formData.Rera_Number_multiple.some(
        (item) => item.tower_name.trim() && item.rera_number.trim()
      )
    ) {
      toast.error("At least one RERA Tower Name and Number is required.");
      return false;
    }
    if (formData.image.length === 0) {
      toast.error("Project Logo is required.");
      return false;
    }
    if (!formData.Property_Type.length === 0) {
      toast.error("Property Type is required.");
      return false;
    }
    if (!formData.building_type) {
      toast.error("Building Type is required.");
      return false;
    }
    if (!formData.Project_Construction_Status) {
      toast.error("Construction Status is required.");
      return false;
    }
    if (!formData.Configuration_Type.length) {
      toast.error("Configuration Type is required.");
      return false;
    }
    if (!formData.Project_Name) {
      toast.error("Project Name is required.");
      return false;
    }
    if (!formData.project_address) {
      toast.error("Location is required.");
      return false;
    }
    if (!formData.project_tag) {
      toast.error("Project Tag is required.");
      return false;
    }
    if (!formData.Project_Description) {
      toast.error("Project Description is required.");
      return false;
    }
    if (!formData.Price_Onward) {
      toast.error("Price Onward is required.");
      return false;
    }
    if (!formData.Rera_Carpet_Area_Sq_M) {
      toast.error("RERA Carpet Area (Sq. M) is required.");
      return false;
    }
    if (!formData.Rera_Carpet_Area_sqft) {
      toast.error("RERA Carpet Area (Sq. Ft.) is required.");
      return false;
    }
    if (!formData.Number_Of_Towers) {
      toast.error("Number of Towers is required.");
      return false;
    }
    if (!formData.no_of_floors) {
      toast.error("Number of Floors is required.");
      return false;
    }
    if (!formData.Number_Of_Units) {
      toast.error("Number of Units is required.");
      return false;
    }
    if (!formData.Land_Area) {
      toast.error("Land Area is required.");
      return false;
    }
    if (!formData.land_uom) {
      toast.error("Land UOM is required.");
      return false;
    }
    // if (!formData.Rera_Number_multiple) {
    //   toast.error("RERA Number is required.");
    //   return false;
    // }

    if (!formData.Amenities.length) {
      toast.error("Amenities are required.");
      return false;
    }
    if (!formData.Address || !formData.Address.address_line_1) {
      toast.error("Address Line 1 is required.");
      return false;
    }
    if (!formData.Address || !formData.Address.city) {
      toast.error("City is required.");
      return false;
    }
    if (!formData.Address || !formData.Address.state) {
      toast.error("State is required.");
      return false;
    }
    if (!formData.Address || !formData.Address.pin_code) {
      toast.error("Pin Code is required.");
      return false;
    }
    if (!formData.Address || !formData.Address.country) {
      toast.error("Country is required.");
      return false;
    }
    if (!formData.map_url) {
      toast.error("Map URL is required.");
      return false;
    }
    if (!formData.ProjectBrochure.length === 0) {
      toast.error("Brochure is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoading(true);

    if (!validateForm(formData)) {
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();

    // Append simple fields
    data.append("project[Property_Type]", formData.Property_Type?.value || "");
    data.append("project[building_type]", formData.building_type?.value || "");
    data.append("project[SFDC_Project_Id]", formData.SFDC_Project_Id || "");
    data.append(
      "project[Project_Construction_Status]",
      formData.Project_Construction_Status?.value || ""
    );
    data.append(
      "project[Configuration_Type]",
      formData.Configuration_Type.join(",")
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
    data.append("project[Amenities]", formData.Amenities.join(","));
    data.append("project[Specifications]", formData.Specifications.join(","));
    data.append("project[Land_Area]", formData.Land_Area || "");
    data.append("project[land_uom]", formData.land_uom?.value || "");
    data.append("project[project_tag]", formData.project_tag?.value || "");
    data.append("project[virtual_tour_url_multiple]", ""); // Adjust if needed
    data.append("project[map_url]", formData.map_url || "");

    // Address fields
    data.append(
      "project[address][address_line_1]",
      formData.Address.address_line_1 || ""
    );
    data.append(
      "project[address][address_line_2]",
      formData.Address.address_line_2 || ""
    );
    data.append("project[address][city]", formData.Address.city || "");
    data.append("project[address][state]", formData.Address.state || "");
    data.append("project[address][pin_code]", formData.Address.pin_code || "");
    data.append("project[address][country]", formData.Address.country || "");

    // Image (single file)
    if (formData.image instanceof File) {
      data.append("project[image]", formData.image, formData.image.name);
    }

    // Gallery images (multiple files)
    if (Array.isArray(formData.gallery_image)) {
      formData.gallery_image.forEach((imgObj) => {
        if (imgObj.gallery_image instanceof File) {
          data.append(
            "project[gallery_image][]",
            imgObj.gallery_image,
            imgObj.gallery_image.name
          );
        }
      });
    }

    // Brochure (multiple files)
    if (Array.isArray(formData.ProjectBrochure)) {
      formData.ProjectBrochure.forEach((file) => {
        if (file instanceof File) {
          data.append("project[ProjectBrochure]", file, file.name);
        }
      });
    }

    if (Array.isArray(formData.Rera_Number_multiple)) {
      formData.Rera_Number_multiple.forEach((item, index) => {
        if (item.tower_name || item.rera_number) {
          // Only send non-empty rows
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

    console.log("Submitting data:", data);
    console.log("Submitting data:");
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await axios.post(`${BASE_URL}projects.json`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // Do NOT set 'Content-Type' manually for FormData!
        },
      });

      toast.success("Project submitted successfully");
      Navigate("/project-list");
    } catch (error) {
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      // const token = "RnPRz2AhXvnFIrbcRZKpJqA8aqMAP_JEraLesGnu43Q"; // Replace with your actual token
      const url = `${BASE_URL}/get_property_types.json`;

      try {
        const response = await axios.get(url, {
          // headers: {
          //     Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          //     "Content-Type": "application/json",
          //    },
        });

        setprojectsType(response.data?.property_types);
        console.log("projectsType", projectsType);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchConfigurations = async () => {
      const url = `${BASE_URL}/configuration_setups.json`;

      try {
        const response = await axios.get(url);
        setConfigurations(response.data);
        console.log("configurations", response.data);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    };

    fetchConfigurations();
  }, []);

  const handleImageNameChange = (e, index) => {
    const { value } = e.target;

    setFormData((prev) => {
      const updatedGallery = [...prev.gallery_image];
      updatedGallery[index].gallery_image_file_name = value;

      return { ...prev, gallery_image: updatedGallery };
    });
  };

  const handleCreativeImageNameChange = (e, index) => {
    const { value } = e.target;
    setFormData((prev) => {
      const updatedCreatives = [...prev.creative_images];
      updatedCreatives[index].creative_image_file_name = value;
      return { ...prev, creative_images: updatedCreatives };
    });
  };

  const handleDiscardCreative = (index) => {
    setFormData((prev) => ({
      ...prev,
      creative_images: prev.creative_images.filter((_, i) => i !== index),
    }));
  };

  const handleCreativeImageUpload = (event, type) => {
    const files = Array.from(event.target.files);

    if (!selectedCreativeType) {
      alert("Please select a creative type first.");
      return;
    }

    const updatedImages = files.map((file) => ({
      creative_image: file, // Actual image file
      creative_image_file_name: file.name, // Image name
      creative_type: selectedCreativeType, // Selected type
    }));

    setFormData((prev) => ({
      ...prev,
      [`${type}_images`]: [...(prev[`${type}_images`] || []), ...updatedImages],
    }));

    event.target.value = ""; // Reset file input
  };

  useEffect(() => {
    const fetchSpecifications = async () => {
      const url = `${BASE_URL}/specification_setups.json`;

      try {
        const response = await axios.get(url);
        if (response.data && response.data.specification_setups) {
          setSpecifications(response.data.specification_setups);
        }
      } catch (error) {
        console.error("Error fetching specifications:", error);
      }
    };

    fetchSpecifications();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      // const token = "RnPRz2AhXvnFIrbcRZKpJqA8aqMAP_JEraLesGnu43Q"; // Replace with your actual token
      const url = `${BASE_URL}/amenity_setups.json`;

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        setAmenities(response.data?.amenities_setups);
        console.log("amenities_setups", amenities);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchCategoryTypes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/category_types.json`);

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

  const handleCancel = () => {
    setFormData({
      Property_Type: "",
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
      Number_Of_Towers: "",
      Number_Of_Units: "",
      no_of_floors: "",
      Rera_Number_multiple: [],
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
      brochure: [],
      gallery_image: [],
    });
    Navigate(-1);
  };

  const statusOptions = {
    OfficeParks: [
      { value: "Completed", label: "Completed" },
      { value: "Under-Construction", label: "Under Construction" },
    ],
    Residential: [
      { value: "Completed", label: "Completed" },
      { value: "Ready-To-Move-in", label: "Ready To Move in" },
    ],
  };

  console.log("formData", formData);
  console.log("specification", specifications);

  const handleTowerChange = (e) => {
    setTowerName(e.target.value);
  };

  const handleReraNumberChange = (e) => {
    const { value } = e.target;

    // Allow only alphanumeric characters (letters & numbers) & limit to 12 chars
    if (/^[a-zA-Z0-9]{0,12}$/.test(value)) {
      setReraNumber(value);
    }
  };

  const handleReraNumberBlur = () => {
    if (reraNumber.length !== 12) {
      toast.error("RERA Number must be exactly 12 alphanumeric characters!", {
        position: "top-right",
        autoClose: 3000, // Closes after 3 seconds
      });

      setReraNumber(""); // Reset field if invalid
    }
  };

  const handleAddRera = () => {
    // Dismiss any existing toast notifications before showing a new one
    toast.dismiss();

    if (!towerName.trim() || !reraNumber.trim()) {
      toast.error("Both Tower and RERA Number are required.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      Rera_Number_multiple: [
        ...prev.Rera_Number_multiple,
        {
          tower_name: towerName,
          rera_number: reraNumber,
        },
      ],
    }));

    // Clear input fields after adding
    setTowerName("");
    setReraNumber("");
  };

  // Handle Deleting a RERA Entry
  const handleDeleteRera = (index) => {
    setFormData((prev) => ({
      ...prev,
      Rera_Number_multiple: prev.Rera_Number_multiple.filter(
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
    // Dismiss any existing toast messages before showing a new one
    toast.dismiss();

    if (!virtualTourUrl.trim() || !virtualTourName.trim()) {
      toast.error("Both URL and Name are required.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      virtual_tour_url_multiple: [
        ...prev.virtual_tour_url_multiple,
        {
          virtual_tour_url: virtualTourUrl,
          virtual_tour_name: virtualTourName,
        },
      ],
    }));

    // Clear input fields after adding
    setVirtualTourUrl("");
    setVirtualTourName("");
  };

  const handleDeleteVirtualTour = (index) => {
    setFormData((prev) => ({
      ...prev,
      virtual_tour_url_multiple: prev.virtual_tour_url_multiple.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    // if (!selectedCategory) {
    //   alert("Please select an image category first.");
    //   return;
    // }

    const updatedImages = files.map((file) => ({
      gallery_image: file, // ✅ Store actual File
      gallery_image_file_name: file.name,
      gallery_image_file_type: selectedCategory,
    }));

    setFormData((prev) => ({
      ...prev,
      gallery_image: [...(prev.gallery_image || []), ...updatedImages], // ✅ Ensure existing images are not overwritten
    }));

    event.target.value = ""; // Reset file input
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

  const propertyTypeOptions = [
    { value: "Office Parks", label: "Office Parks" },
    { value: "Residential", label: "Residential" },
  ];

  const buildingTypeOptions = {
    OfficeParks: [
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
        <div className="card mt-3 pb-4 mx-4">
          <div className="card-header">
            <h3 className="card-title">Create Project</h3>
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
                    multiple
                    required
                    onChange={(e) => handleFileChange(e, "image")}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Property Types
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <SelectBox
                    options={propertyTypeOptions}
                    value={formData.Property_Type}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        Property_Type: value,
                        building_type: "", // ✅ Reset building_type when Property_Type changes
                      }))
                    }
                  />
                </div>
              </div>

              {/* Project Building Type Dropdown */}
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
                    options={buildingTypeOptions.OfficeParks || []} // ✅ Show correct options
                    value={formData.building_type}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        building_type: value,
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
                    options={statusOptions.OfficeParks || []}
                    defaultValue={formData.Project_Construction_Status}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        Project_Construction_Status: value,
                      }))
                    }
                    //isDisableFirstOption={true}
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
                    placeholder="Enter Project Name"
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
                    name="project_address"
                    placeholder="Enter Location"
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
                    //isDisableFirstOption={true}
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
                    name="Project_Description"
                    placeholder="Enter Project Description"
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
                    name="Price_Onward"
                    placeholder="Enter Price Onward"
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
                    name="Project_Size_Sq_Mtr"
                    placeholder="Enter Size in Sq. Mtr."
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
                    name="Project_Size_Sq_Ft"
                    placeholder="Enter Size in Sq. Ft."
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
                    RERA Carpet Area (Sq. M)
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="Rera_Carpet_Area_Sq_M"
                    placeholder="Enter RERA Carpet Area (Sq. M)"
                    value={formData.Rera_Carpet_Area_Sq_M}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    RERA Carpet Area (Sq. Ft.)
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="Rera_Carpet_Area_sqft"
                    placeholder="Enter RERA Carpet Area (Sq. Ft.)"
                    value={formData.Rera_Carpet_Area_sqft}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    RERA Sellable Area
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="text-number"
                    name="Rera_Sellable_Area"
                    placeholder="Enter Rera Sellable Area"
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
                    name="Number_Of_Towers"
                    placeholder="Enter Number of Towers"
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
                    name="Number_Of_Units"
                    placeholder="Enter Number of Units"
                    value={formData.Number_Of_Units}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Specifications
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <MultiSelectBox
                    options={specifications.map((spec) => ({
                      value: spec.id,
                      label: spec.name,
                    }))}
                    value={formData.Specifications.map((specId) => {
                      const spec = specifications.find((s) => s.id === specId);
                      return spec ? { value: spec.id, label: spec.name } : null;
                    }).filter(Boolean)}
                    onChange={(selectedOptions) =>
                      setFormData((prev) => ({
                        ...prev,
                        Specifications: selectedOptions.map(
                          (option) => option.value
                        ),
                      }))
                    }
                    placeholder="Select Specifications"
                  />
                </div>
              </div> */}

              <div className="col-md-3 mt-2">
                <div className="form-group">
                  <label>
                    Land Area
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
                      {" "}
                      *
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="Land_Area"
                    placeholder="Enter Land Area"
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
                    value={formData?.land_uom || ""}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        land_uom: value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RERA Number Section */}
        <div className="card mt-3 pb-4 mx-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="card-title">RERA Number</h3>
            <button
              className="purple-btn2 rounded-3"
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
          <div className="card-body mt-0 pb-0">
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
                            onChange={(e) => {
                              const updated = [
                                ...formData.Rera_Number_multiple,
                              ];
                              updated[index].tower_name = e.target.value;
                              setFormData((prev) => ({
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
                            onChange={(e) => {
                              const updated = [
                                ...formData.Rera_Number_multiple,
                              ];
                              updated[index].rera_number = e.target.value;
                              setFormData((prev) => ({
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
                                setFormData((prev) => ({
                                  ...prev,
                                  Rera_Number_multiple:
                                    prev.Rera_Number_multiple.filter(
                                      (_, i) => i !== index
                                    ),
                                }));
                              }
                            }}
                            disabled={
                              formData.Rera_Number_multiple.length === 1
                            }
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
              {/* Multi-Select Amenities Dropdown */}
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
                      value: ammit.id,
                      label: ammit.name,
                    }))}
                    value={formData.Amenities.map((id) => {
                      const ammit = amenities.find((ammit) => ammit.id === id);
                      return ammit
                        ? { value: ammit.id, label: ammit.name }
                        : null;
                    }).filter(Boolean)}
                    onChange={(selectedOptions) =>
                      setFormData((prev) => ({
                        ...prev,
                        Amenities: selectedOptions.map(
                          (option) => option.value
                        ),
                      }))
                    }
                    placeholder="Select amenities"
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
                    Address Line 1
                    <span style={{ color: "#de7008", fontSize: "16px" }}>
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
                    {/* <span style={{ color: "#de7008", fontSize: "16px" }}>
                      *
                    </span>{" "} */}
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
                    maxLength={6} // Prevents typing more than 6 digits
                    onChange={(e) => {
                      const { name, value } = e.target;
                      // Allow only numbers (0-9) and ensure max 6 digits
                      if (/^\d{0,6}$/.test(value)) {
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
                    type="url"
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
        {/* file Upload */}
        <div className="card mt-3 pb-4 mx-4">
          <div className="card-header">
            <h3 className="card-title">File Upload</h3>
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
                  {/* Dropdown for Category Selection */}
                  {/* <div className="me-2">
                    <SelectBox
                      options={categoryTypes} // Already formatted in the correct format
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

              {/* Gallery Table */}
              <div className="col-md-12 mt-2">
                <div className="mt-4 tbl-container">
                  <table className="w-100">
                    <thead>
                      <tr>
                        {/* <th>Image Category</th> */}
                        <th>File Name</th>
                        <th>Preview</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.gallery_image.map((file, index) => (
                        <tr key={index}>
                          {/* <td>{file.gallery_image_file_type}</td> */}
                          <td>
                            <input
                              className="form-control"
                              type="text"
                              name="gallery_image_file_name"
                              placeholder="Enter Image Name"
                              value={file.gallery_image_file_name}
                              onChange={(e) => handleImageNameChange(e, index)}
                            />

                            {/* <input
                  
                  name="file.gallery_image_file_name"
                  value={file.gallery_image_file_name}

                  onChange={handleChange}
                  /> */}
                          </td>
                          <td>
                            <img
                              style={{ maxWidth: 100, maxHeight: 100 }}
                              className="img-fluid rounded"
                              src={URL.createObjectURL(file.gallery_image)}
                              alt={file.gallery_image_file_name}
                            />
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
              {/* Brochure Upload */}
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
                  fdprocessedid="xn3e6n"
                  onClick={() => document.getElementById("brochure").click()}
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
                <input
                  id="brochure"
                  className="form-control"
                  type="file"
                  name="brochure"
                  accept=".pdf,.docx"
                  onChange={(e) => handleFileUpload("brochure", e.target.files)}
                  multiple // Add this to allow multiple file selection
                  style={{ display: "none" }}
                />
              </div>

              <div className="col-md-12 mt-2">
                <div className="mt-4 tbl-container">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.ProjectBrochure.length > 0 ? (
                        formData.ProjectBrochure.map((brochure, index) => (
                          <tr key={`brochures-${index}`}>
                            <td>{brochure.name}</td>
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
                          <td colSpan="2" className="text-center">
                            No brochures uploaded
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body mt-0 pb-0"></div>
        <div className="row mt-2 justify-content-center">
          <div className="col-md-2">
            <button
              onClick={handleSubmit}
              className="purple-btn2 w-100"
              disabled={loading}
            >
              Submit
            </button>
          </div>
          <div className="col-md-2">
            <button
              type="button"
              onClick={handleCancel}
              className="purple-btn2 w-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsCreate;
