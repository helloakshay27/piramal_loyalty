import React, { useRef, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const validationSchema = Yup.object().shape({
  heading: Yup.string().required("Heading is required"),
  content: Yup.string().required("Content is required"),
  tag_type: Yup.string().required("Tag type is required"),
  summary: Yup.string().required("Summary is required"),
  author: Yup.string().required("Author is required"),
  image: Yup.mixed().required("Image is required"),
  client_name: Yup.string().required("Client name is required"),
  status: Yup.string().required("Status is required"),
  updated_on: Yup.string().required("Updated on is required"),
  publish_date: Yup.string().required("Publish date is required"),
  end_date: Yup.string().required("End date is required"),
});

const initialValues = {
  heading: "",
  content: "",
  tag_type: "",
  summary: "",
  author: "",
  image: null,
  client_name: "",
  status: "",
  visible_to_all: false,
  accept_comment: false,
  updated_on: "",
  publish_date: "",
  end_date: "",
  priority: "",
  survey_id: "",
};

const BLOG_POST_URL = "https://piramal-loyalty-dev.lockated.com/blog_posts.json";
const POSTS_API = "https://piramal-loyalty-dev.lockated.com/blog_posts.json";

const NewBlog = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setLoadingPosts(true);
    fetch(POSTS_API)
      .then(res => res.json())
      .then(data => {
        // Combine featured and latest
        const featured = Array.isArray(data.featured) ? data.featured : [];
        const latest = Array.isArray(data.latest) ? data.latest : [];
        setPosts([...featured, ...latest]);
      })
      .finally(() => setLoadingPosts(false));
  }, []);

  const totalPages = Math.ceil(posts.length / pageSize);
  const paginatedPosts = posts.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-100">
      <div className="module-data-section mt-2 flex-grow-1" style={{ position: "relative", height: "100%" }}>
        <p className="pointer">
          <span>Blog</span> &gt; New Blog Post
        </p>
        <h5 className="mb-3">
          <span className="title">New Blog Post</span>
        </h5>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            const formData = new FormData();
            // Add authenticity_token if needed
            // formData.append("authenticity_token", "your_token_here");
            formData.append("blog_post[heading]", values.heading);
            formData.append("blog_post[content]", values.content);
            formData.append("blog_post[tag_type]", values.tag_type);
            formData.append("blog_post[summary]", values.summary);
            formData.append("blog_post[author]", values.author);
            if (values.image) formData.append("blog_post[image]", values.image);
            formData.append("blog_post[client_name]", values.client_name);
            formData.append("blog_post[status]", values.status);
            formData.append("blog_post[visible_to_all]", values.visible_to_all ? "1" : "0");
            formData.append("blog_post[accept_comment]", values.accept_comment ? "1" : "0");
            formData.append("blog_post[updated_on]", values.updated_on);
            formData.append("blog_post[publish_date]", values.publish_date);
            formData.append("blog_post[end_date]", values.end_date);
            formData.append("blog_post[priority]", values.priority || "");
            formData.append("blog_post[survey_id]", values.survey_id || "");
            formData.append("commit", "Create Blog post");

            try {
              const response = await fetch(BLOG_POST_URL, {
                method: "POST",
                headers: {
                  Accept: "text/vnd.turbo-stream.html",
                },
                body: formData,
              });
              if (response.ok) {
                setStatus({ success: "Blog post created successfully!" });
                navigate("/blogs");
              } else {
                throw new Error(`Unexpected response: ${response.status}`);
              }
            } catch (error) {
              setStatus({ error: error.message || "Failed to create blog post." });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, values, isSubmitting, status }) => (
            <Form encType="multipart/form-data">
              <div className="row">
                <div className="col-md-6 col-sm-11 mb-3">
                  <fieldset className="border">
                    <legend className="float-none">
                      Heading<span>*</span>
                    </legend>
                    <Field name="heading" placeholder="Enter Heading" className="form-control border-0" />
                  </fieldset>
                  <ErrorMessage name="heading" component="div" className="text-danger" />
                </div>
                <div className="col-md-6 col-sm-11 mb-3">
                  <fieldset className="border">
                    <legend className="float-none">
                      Type<span>*</span>
                    </legend>
                    <Field as="select" name="tag_type" className="form-control border-0">
                      <option value="">Select Tag Type</option>
                      <option value="featured">Featured</option>
                      <option value="latest">Latest</option>
                    </Field>
                  </fieldset>
                  <ErrorMessage name="tag_type" component="div" className="text-danger" />
                </div>
              </div>
              <div className="mb-3 col-sm-11">
                <fieldset className="border">
                  <legend className="float-none">
                    Content<span>*</span>
                  </legend>
                  <Field as="textarea" name="content" className="form-control border-0" rows={6} placeholder="Enter Content" />
                </fieldset>
                <ErrorMessage name="content" component="div" className="text-danger" />
              </div>
              <div className="mb-3 col-sm-11">
                <fieldset className="border">
                  <legend className="float-none">
                    Summary<span>*</span>
                  </legend>
                  <Field as="textarea" name="summary" className="form-control border-0" placeholder="Enter Summary" />
                </fieldset>
                <ErrorMessage name="summary" component="div" className="text-danger" />
              </div>
              <div className="row">
                <div className="col-md-4 col-sm-11 mb-3">
                  <fieldset className="border">
                    <legend className="float-none">
                      Author<span>*</span>
                    </legend>
                    <Field name="author" placeholder="Enter Author" className="form-control border-0" />
                  </fieldset>
                  <ErrorMessage name="author" component="div" className="text-danger" />
                </div>
                <div className="col-md-4 col-sm-11 mb-3">
                  <fieldset className="border">
                    <legend className="float-none">
                      Client Name<span>*</span>
                    </legend>
                    <Field name="client_name" placeholder="Enter Client Name" className="form-control border-0" />
                  </fieldset>
                  <ErrorMessage name="client_name" component="div" className="text-danger" />
                </div>
                <div className="col-md-4 col-sm-11 mb-3">
                  <fieldset className="border">
                    <legend className="float-none">
                      Status<span>*</span>
                    </legend>
                    <Field name="status" placeholder="Enter Status" className="form-control border-0" />
                  </fieldset>
                  <ErrorMessage name="status" component="div" className="text-danger" />
                </div>
              </div>
              <div className="mb-3 col-sm-11">
                <fieldset className="border p-3" >
                  <legend className="float-none">
                    Upload Display Image<span>*</span>
                  </legend>
                  <input
                    name="image"
                    type="file"
                    className="form-control border-0"
                    ref={fileInputRef}
                    onChange={event => {
                      setFieldValue("image", event.currentTarget.files?.[0]);
                    }}
                  />
                </fieldset>
                <ErrorMessage name="image" component="div" className="text-danger" />
              </div>
              <div className="row">
                <div className="col-md-3 col-sm-11 mb-3">
                    <label className="mb-0">
                      <Field type="checkbox" name="visible_to_all" />
                      {" "}Visible to all
                    </label>
                </div>
                <div className="col-md-3 col-sm-11 mb-3">
                    <label className="mb-0">
                      <Field type="checkbox" name="accept_comment" />
                      {" "}Accept comment
                    </label>
                </div>
                <div className="col-md-3 col-sm-11 mb-3">
                  <fieldset className="border">
                    <legend className="float-none">
                      Updated on<span>*</span>
                    </legend>
                    <Field name="updated_on" type="datetime-local" className="form-control border-0" />
                  </fieldset>
                  <ErrorMessage name="updated_on" component="div" className="text-danger" />
                </div>
                <div className="col-md-3 col-sm-11 mb-3">
                  <fieldset className="border">
                    <legend className="float-none">
                      Publish date<span>*</span>
                    </legend>
                    <Field name="publish_date" type="datetime-local" className="form-control border-0" />
                  </fieldset>
                  <ErrorMessage name="publish_date" component="div" className="text-danger" />
                </div>
                <div className="col-md-3 col-sm-11 mb-3">
                  <fieldset className="border">
                    <legend className="float-none">
                      End date<span>*</span>
                    </legend>
                    <Field name="end_date" type="datetime-local" className="form-control border-0" />
                  </fieldset>
                  <ErrorMessage name="end_date" component="div" className="text-danger" />
                </div>
                <div className="col-md-3 col-sm-11 mb-3">
                  <fieldset className="border">
                    <legend className="float-none">Priority</legend>
                    <Field name="priority" type="number" className="form-control border-0" placeholder="Enter Priority" />
                  </fieldset>
                </div>
                <div className="col-md-3 col-sm-11 mb-3">
                  <fieldset className="border">
                    <legend className="float-none">Survey</legend>
                    <Field name="survey_id" type="number" className="form-control border-0" placeholder="Enter Survey ID" />
                  </fieldset>
                </div>
              </div>
              <div className="row justify-content-center align-items-center">
                <div className="col-md-2 col-sm-5 mb-2">
                  <button type="submit" className="purple-btn1 w-100" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Submit"}
                  </button>
                </div>
                <div className="col-md-2 col-sm-5 mb-2">
                  <button
                    type="reset"
                    className="purple-btn2 w-100"
                    onClick={() => navigate("/blogs")}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              {status?.success && <div className="text-success mt-2">{status.success}</div>}
              {status?.error && <div className="text-danger mt-2">{status.error}</div>}
            </Form>
          )}
        </Formik>
      </div>
      <Footer />

      {/* <div className="container mt-5">
        <h5>Blog Posts</h5>
        {loadingPosts ? (
          <div>Loading...</div>
        ) : (
          <>
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Heading</th>
                  <th>Tag Type</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Publish Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center">No posts found</td>
                  </tr>
                ) : (
                  paginatedPosts.map(post => (
                    <tr key={post.id}>
                      <td>{post.heading}</td>
                      <td>{post.tag_type}</td>
                      <td>{post.author}</td>
                      <td>{post.status}</td>
                      <td>{post.publish_date ? new Date(post.publish_date).toLocaleString() : ""}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="d-flex justify-content-between align-items-center">
              <span>
                Showing {posts.length === 0 ? 0 : (page - 1) * pageSize + 1}
                {" - "}
                {Math.min(page * pageSize, posts.length)} of {posts.length}
              </span>
              <div>
                <button
                  className="btn btn-secondary btn-sm me-2"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Prev
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                  className="btn btn-secondary btn-sm ms-2"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div> */}
    </div>
  );
};

export default NewBlog;
