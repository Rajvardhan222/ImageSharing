import FormPost from "@/components/FormPost";
import { useGetPostById } from "@/lib/react-query/queriesandMutations";
import Loader from "@/shared/Loader";

import { useParams } from "react-router-dom";

function EditPost() {
  let {id} = useParams();
  const {data:Post,isPending} = useGetPostById(id||'')
  if (isPending) {
    return <Loader/>
  }
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div
          className="max-w-5xl flex-start gap-3 justify-start
    w-full"
        >
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>
        <FormPost action="Update" post={Post}/>
      </div>
    </div>
  );
}

export default EditPost;
