import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import MDEditor from "@uiw/react-md-editor";
import Checkbox from "@mui/material/Checkbox";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { styled, useTheme } from "@mui/material/styles";
import { FaTag, FaRegClock, FaUser, FaReply } from "react-icons/fa";
import { TbSubtask } from "react-icons/tb";
import { IoMdSend } from "react-icons/io";
import { MdClose } from "react-icons/md";
import Avatar from "@mui/material/Avatar";
import DynamicPopoverWrapper from "./DynamicPopverWrapper";
import DatesMenuContent from "./DatesMenuContent";
import SubtaskMenuContent from "./SubTasks";
import MembersMenuContent from "./MembersMenuContent";
import AttachmentsMenuContent from "./AttachmentsMenuContent";
import { useDataMutation, useDataQuery } from "@/lib/tanstack/useDataQuery";
import toast from "react-hot-toast";

const DarkCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: 0,
  "&.Mui-checked": {
    color: theme.palette.warning.light,
  },
}));

const ChatTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    bgcolor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderRadius: "24px",
    "& fieldset": {
      borderColor: theme.palette.divider,
      borderRadius: "24px",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.divider,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const formatActivityTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
};

const CommentItem = ({ comment, level = 0, taskId, onReplySubmit, theme }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const replyInputRef = useRef(null);

  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    setIsReplying(true);
    try {
      await onReplySubmit(replyText.trim(), comment.id);
      setReplyText("");
      setShowReplyInput(false);
    } finally {
      setIsReplying(false);
    }
  };

  const handleReplyKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReplySubmit();
    }
  };

  const handleReplyClick = () => {
    setShowReplyInput(true);
    setTimeout(() => {
      if (replyInputRef.current) {
        replyInputRef.current.focus();
      }
    }, 100);
  };

  return (
    <Box
      sx={{
        ml: level > 0 ? 4 : 0,
        mb: 2,
        position: "relative",
        "&:before":
          level > 0
            ? {
                content: '""',
                position: "absolute",
                left: -20,
                top: 0,
                bottom: 0,
                width: "2px",
                bgcolor: theme.palette.divider,
                borderRadius: "1px",
              }
            : {},
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          p: 1.5,
          borderRadius: 2,
          bgcolor:
            level === 0
              ? theme.palette.background.paper
              : theme.palette.action.hover,
          border: `1px solid ${theme.palette.divider}`,
          transition: "background-color 0.2s ease",
          "&:hover": {
            bgcolor:
              level === 0
                ? theme.palette.action.hover
                : theme.palette.action.selected,
          },
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: theme.palette.primary.main,
            fontSize: "0.875rem",
          }}
        >
          {comment.createdBy?.firstName?.[0] || "U"}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {comment.createdBy?.firstName || "User"}{" "}
              {comment.createdBy?.lastName || ""}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.75rem",
              }}
            >
              {formatActivityTime(comment.createdAt)}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.primary,
              mb: 1,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {comment.body}
          </Typography>

          {level < 2 && (
            <IconButton
              size="small"
              onClick={handleReplyClick}
              sx={{
                mt: 0.5,
                color: theme.palette.text.secondary,
                "&:hover": {
                  color: theme.palette.primary.main,
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <FaReply size={12} />
              <Typography
                variant="caption"
                sx={{ ml: 0.5, fontSize: "0.75rem" }}
              >
                Reply
              </Typography>
            </IconButton>
          )}
        </Box>
      </Box>

      {showReplyInput && (
        <Box
          sx={{ mt: 2, ml: 6, display: "flex", alignItems: "center", gap: 1 }}
        >
          <Avatar
            sx={{
              width: 28,
              height: 28,
              bgcolor: theme.palette.secondary.main,
              fontSize: "0.75rem",
            }}
          >
            {"Y"}
          </Avatar>
          <Box sx={{ flex: 1, position: "relative" }}>
            <ChatTextField
              inputRef={replyInputRef}
              fullWidth
              size="small"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleReplyKeyDown}
              placeholder="Write a reply..."
              disabled={isReplying}
              sx={{
                "& .MuiOutlinedInput-root": {
                  pr: 6,
                },
              }}
            />
            <IconButton
              size="small"
              onClick={handleReplySubmit}
              disabled={!replyText.trim() || isReplying}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                color: theme.palette.primary.main,
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
                "&:disabled": {
                  color: theme.palette.action.disabled,
                },
              }}
            >
              <IoMdSend size={16} />
            </IconButton>
          </Box>
          <IconButton
            size="small"
            onClick={() => setShowReplyInput(false)}
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": {
                color: theme.palette.text.primary,
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            <MdClose size={16} />
          </IconButton>
        </Box>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              level={level + 1}
              taskId={taskId}
              onReplySubmit={onReplySubmit}
              theme={theme}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

const TaskDialogContent = ({ task }: any) => {
  const [description, setDescription] = useState(task.description);
  const theme = useTheme();
  const [isCompleted, setIsCompleted] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [currentPopover, setCurrentPopover] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const commentInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Query to fetch comments with replies and createdBy user data
  const {
    data: commentsData,
    isLoading: commentsLoading,
    isError: commentsError,
    refetch: refetchComments,
  } = useDataQuery({
    apiEndPoint: `https://api.techbee.et/api/project/comments?where[wbsItem][id]=${task.id}&populate[0]=createdBy&populate[1]=replies&populate[2]=replies.createdBy`,
  });

  const comments = commentsData?.data || [];

  // Create comment mutation
  const { mutate: createComment, isPending: creatingComment } = useDataMutation(
    {
      apiEndPoint: "https://api.techbee.et/api/project/comments",
      method: "POST",
      onError: (error) => {
        toast.error(error?.message || "Error creating comment");
      },
      onSuccess: () => {
        toast.success("Comment added successfully");
        setCommentValue("");
        refetchComments();
      },
    }
  );

  // Create reply mutation
  const { mutate: createReply, isPending: creatingReply } = useDataMutation({
    apiEndPoint: "https://api.techbee.et/api/project/comments",
    method: "POST",
    onError: (error) => {
      toast.error(error?.message || "Error creating reply");
    },
    onSuccess: () => {
      toast.success("Reply added successfully");
      refetchComments();
    },
  });

  const { mutate: updateDescription, isPending } = useDataMutation({
    apiEndPoint: "https://api.techbee.et/api/project/wbsItems/" + task.id,
    method: "PATCH",
    invalidateQueryKey: ["data", "https://api.techbee.et/api/project/wbsItems"],
    onSuccess: (success) => {
      toast.success(success?.message || "SUCCESS");
      setDescription(success.description);
    },
    onError: (error) => toast.error(error?.message || "ERROR"),
  });

  const handleSave = () => {
    updateDescription({ description });
  };

  const handlePopoverClose = useCallback(() => {
    setAnchorEl(null);
    setCurrentPopover(null);
  }, []);

  const handlePopoverOpen = (event, config) => {
    setAnchorEl(event.currentTarget);
    setCurrentPopover(config);
  };

  const handleCommentSubmit = async (
    commentText = commentValue,
    parentCommentId = null
  ) => {
    const textToSubmit = commentText || commentValue;

    if (!textToSubmit.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    // Create payload based on whether it's a reply or top-level comment
    const payload = {
      body: textToSubmit.trim(),
      wbsItem: { id: task.id },
      isInternal: false,
    };

    // If it's a reply, add parentComment field
    if (parentCommentId) {
      payload.parentComment = { id: parentCommentId };
    }

    const mutation = parentCommentId ? createReply : createComment;
    mutation(payload);

    if (!parentCommentId) {
      setCommentValue("");
    }
  };

  const handleCommentKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  // Scroll to bottom when new comments are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [comments]);

  const popoverConfigs = useMemo(
    () => [
      {
        id: "attachments",
        title: "Documents and Files",
        icon: <FaTag size={14} className="mr-1" />,
        content: <AttachmentsMenuContent task={task} />,
      },
      {
        id: "dates",
        title: "Dates Menu",
        icon: <FaRegClock size={14} className="mr-1" />,
        content: <DatesMenuContent onClose={handlePopoverClose} task={task} />,
      },
      {
        id: "Subtask",
        title: "Manage Sub tasks",
        icon: <TbSubtask size={14} className="mr-1" />,
        content: (
          <SubtaskMenuContent task={task} onClose={handlePopoverClose} />
        ),
      },
      {
        id: "members",
        title: "Members List",
        icon: <FaUser size={14} className="mr-1" />,
        content: (
          <MembersMenuContent task={task} onClose={handlePopoverClose} />
        ),
      },
    ],
    [handlePopoverClose]
  );

  const open = Boolean(anchorEl);
  const popoverId = currentPopover ? currentPopover.id : undefined;

  // Focus comment input on component mount
  useEffect(() => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, []);

  // Filter top-level comments (comments without parentComment)
  const topLevelComments = comments.filter((comment) => !comment.parentComment);

  return (
    <Box
      className="w-full h-full flex flex-col overflow-hidden"
      sx={{
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      {}
      <Box className="flex flex-grow overflow-y-auto sm:flex-wrap md:flex-nowrap">
        {}
        <Box
          className="w-full sm:w-full md:w-[calc(100%-20rem)] p-6 md:overflow-y-auto"
          sx={{ pr: { xs: 3, md: 3 }, pl: 3 }}
        >
          <Box sx={{ mb: 3 }}>
            {}
            <h1 className="text-2xl font-bold mb-4 flex items-start">
              <span
                className={`flex-1 pt-1 ${isCompleted ? "line-through" : ""}`}
                style={{
                  color: isCompleted
                    ? theme.palette.text.secondary
                    : theme.palette.text.primary,
                }}
              >
                {task.title}
              </span>
            </h1>
            {}
            <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
              {popoverConfigs.map((config) => (
                <Button
                  key={config.id}
                  variant="contained"
                  size="small"
                  startIcon={config.icon}
                  onClick={(e) => handlePopoverOpen(e, config)}
                  sx={{
                    bgcolor: theme.palette.action.disabledBackground,
                    color: theme.palette.text.secondary,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  {config.id.charAt(0).toUpperCase() + config.id.slice(1)}
                </Button>
              ))}
            </Box>
            {}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <h3 className="text-lg font-semibold">Description</h3>
              <Button
                onClick={handleSave}
                variant="contained"
                loading={isPending}
                size="small"
                sx={{
                  bgcolor: theme.palette.primary.main,
                  "&:hover": { bgcolor: theme.palette.primary.dark },
                }}
              >
                Update
              </Button>
            </Box>
            {}
            <Box
              data-color-mode="dark"
              sx={{ bgcolor: theme.palette.grey[800], borderRadius: 1 }}
            >
              <MDEditor
                value={description}
                onChange={setDescription}
                height={200}
                className="!bg-transparent !text-white !border-gray-700"
                preview="edit"
              />
            </Box>
          </Box>
        </Box>
        {}
        <Box
          className="w-full sm:w-full md:w-80 p-4 flex flex-col overflow-hidden flex-shrink-0"
          sx={{
            borderLeft: { md: 1 },
            borderColor: theme.palette.divider,
            pt: 3,
          }}
        >
          {}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <h3 className="text-lg font-semibold">Chat</h3>
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.secondary }}
            >
              {topLevelComments.length} comments
            </Typography>
          </Box>

          {/* Chat Messages Container */}
          <Box
            ref={chatContainerRef}
            sx={{
              flex: 1,
              overflowY: "auto",
              mb: 2,
              pr: 1,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                bgcolor: theme.palette.background.default,
              },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: theme.palette.divider,
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                bgcolor: theme.palette.text.secondary,
              },
            }}
          >
            {commentsLoading ? (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Loading comments...
                </Typography>
              </Box>
            ) : commentsError ? (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.error.main }}
                >
                  Error loading comments
                </Typography>
                <Button
                  onClick={() => refetchComments()}
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Retry
                </Button>
              </Box>
            ) : topLevelComments.length === 0 ? (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.disabled }}
                >
                  No comments yet. Start the conversation!
                </Typography>
              </Box>
            ) : (
              topLevelComments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  taskId={task.id}
                  onReplySubmit={handleCommentSubmit}
                  theme={theme}
                />
              ))
            )}
          </Box>

          {/* Chat Input */}
          <Box sx={{ position: "relative", mb: 1 }}>
            <ChatTextField
              inputRef={commentInputRef}
              fullWidth
              multiline
              maxRows={4}
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              onKeyDown={handleCommentKeyDown}
              placeholder="Type a message... (Press Enter to send)"
              disabled={creatingComment}
              sx={{
                "& .MuiOutlinedInput-root": {
                  pr: 6,
                },
              }}
            />
            <IconButton
              onClick={() => handleCommentSubmit()}
              disabled={!commentValue.trim() || creatingComment}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                color: commentValue.trim()
                  ? theme.palette.primary.main
                  : theme.palette.text.disabled,
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
                "&:disabled": {
                  color: theme.palette.action.disabled,
                },
              }}
            >
              {creatingComment ? (
                <Typography variant="caption">Sending...</Typography>
              ) : (
                <IoMdSend size={20} />
              )}
            </IconButton>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.disabled,
              textAlign: "center",
              display: "block",
              fontSize: "0.75rem",
            }}
          >
            Press Enter to send • Shift+Enter for new line
          </Typography>
        </Box>
      </Box>
      {}
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {currentPopover && (
          <DynamicPopoverWrapper
            onClose={handlePopoverClose}
            title={currentPopover.title}
          >
            {currentPopover.content}
          </DynamicPopoverWrapper>
        )}
      </Popover>
    </Box>
  );
};

export default TaskDialogContent;
