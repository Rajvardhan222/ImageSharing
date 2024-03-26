import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import authservice from "@/lib/appwrite/user";
import { useGetPostById } from "@/lib/react-query/queriesandMutations";
import { multiFormatDateString } from "@/lib/utils";
import Loader from "@/shared/Loader";
import PostStats from "@/shared/PostStats";
import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

function PostDetails() {
  let { id } = useParams();
  let { data: post, isPending: isLoading } = useGetPostById(id || "");
  const { user } = useUserContext();
  let downloadImage = async () => {
    console.log("Downloading image");

    let result = await authservice.downloadImage(post?.imageid);
    console.log(result);
    const link = document.createElement("a");
    link.href = result.href;
    link.download = "image.jpg"; // Set the filename for the downloaded image

    // Programmatically click the link to trigger the download
    link.click();
  };
  useEffect(() => {
    toast({
      title: "Double click on Image to Download it",
      variant: "destructive",
      duration: 5000,
      className:"z-10 bg-red-500"
    });
  }, []);

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full lg:flex-col">
        <Button
          onClick={() => Navigate(-1)}
          variant="ghost"
          className="shad-button_ghost"
        >
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card lg:max-w-[3000px]">
          <img
            src={post?.imageURl}
            onDoubleClick={() => {
              downloadImage();
            }}
            alt="creator"
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    post?.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>

                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}
                >
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <Button
                  variant="ghost"
                  className={`ost_details-delete_btn ${
                    user.id !== post?.creator.$id && "hidden"
                  }`}
                >
                  <img
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post.tags[0] !== "" &&
                  post?.tags.map((tag: string, index: string) => (
                    <li
                      key={`${tag}${index}`}
                      className="text-light-3 small-regular"
                    >
                      #{tag}
                    </li>
                  ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}

      {/* <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div> */}
    </div>
  );
}

export default PostDetails;
