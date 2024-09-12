export const likeOrUnlike = async (model, id, userId) => {
  const findLike = await model.findOne({ likes: userId });
  if (findLike) {
    await model.findByIdAndUpdate(id, {
      $pull: { likes: req.user._id },
      $inc: { likeNo: -1 },
    });
    return true;
  } else {
    await model.findByIdAndUpdate(id, {
      $push: { likes: req.user._id },
      $inc: { likeNo: 1 },
    });
    return false;
  }
};
