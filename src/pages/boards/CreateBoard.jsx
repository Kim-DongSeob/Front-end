import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  BUCKET,
  awsS3Bucket,
  BASE_S3_URL,
} from '../../shared/utils/awsBucketConfig';
import { createBoardAsync } from 'modules/boards';
import styled, { ThemeContext } from 'styled-components';
import {
  Wrapper,
  Grid,
  Input,
  Image,
  Header,
  Textarea,
  DropdownSelect,
  Text,
} from 'components';

function CreateBoard(props) {
  const themeContext = useContext(ThemeContext);
  const dispatch = useDispatch();

  const options = [
    { value: '학교생활', label: '학교생활' },
    { value: '직장생활', label: '직장생활' },
    { value: '관계/심리', label: '관계/심리' },
    { value: '시사/이슈', label: '시사/이슈' },
    { value: '일상생활', label: '일상생활' },
    { value: '기타', label: '기타' },
  ];

  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [textLength, setTextLength] = useState(0);
  const [previewImage, setPreviewImage] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const changeCategory = (optionSelected) => {
    setCategory(optionSelected.value);
  };

  const changeTitle = (e) => {
    setTitle(e.target.value);
  };

  const changeContent = (e) => {
    const value = e.target.value;
    if (value.length < 300) {
      setTextLength(value.length);
      setContent(value);
    }
  };

  const boardInfo = { title, content, imageUrl, category };

  const hiddenImageInput = React.useRef(null);
  const handleImageClick = (e) => {
    hiddenImageInput.current.click();
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();

    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (folderName, file) => {
    const urlIdentifier = `img-${Math.ceil(Math.random() * 10 ** 10)}`;

    const params = {
      ACL: 'public-read',
      Body: file,
      Bucket: BUCKET,
      Key: folderName + '/' + urlIdentifier,
    };

    await awsS3Bucket.putObject(params).send((response) => {
      const signedUrl = BASE_S3_URL + folderName + '/' + urlIdentifier;
      setImageUrl(signedUrl);
    });
  };

  return (
    <NewWrapper>
      <Grid padding="0px 24px 12px 24px">
        <Header
          label="게시글 작성"
          leftArrow
          rightButtonRender={{
            label: '완료',
            onClickButton: () => {
              handleUpload('boards', selectedFile);
              dispatch(createBoardAsync(boardInfo));
              window.location.assign('/home');
            },
          }}
        />
      </Grid>
      <DropdownSelect
        placeholder="카테고리를 선택해주세요"
        options={options}
        color={themeContext.colors.lightGray}
        onChange={changeCategory}
      />

      <Grid padding="0px 24px 0px 24px">
        <Input
          bold
          width="100%"
          placeholder="제목을 입력해주세요"
          style={{
            border: 'none',
            borderRadius: 0,
            padding: 0,
            fontSize: '16px',
            borderBottom: `1px solid ${themeContext.colors.lightGray}`,
          }}
          onChange={changeTitle}
          margin="0"
        />
      </Grid>
      <Grid padding="16px 24px 0px 24px">
        <Textarea
          fluid
          border="none"
          height="200px"
          placeholder="토론하고 싶은 내용을 작성해주세요"
          onChange={changeContent}
          lineHeight="18px"
        />
        {previewImage && <Image src={previewImage} shape={'rectangle'} />}
        <Text tiny right color={themeContext.colors.darkGray}>
          {textLength} / 300
        </Text>
      </Grid>
      <Grid
        padding="16px 24px 0px 24px"
        style={{ display: 'flex', position: 'fixed', bottom: '10px' }}
      >
        <Grid onClick={handleImageClick}>
          <img src="/asset/icons/Image.svg" alt="image" />
          <input
            type="file"
            style={{ display: 'none' }}
            accept=".jpg,.jpeg,.png,.gif"
            ref={hiddenImageInput}
            onChange={onImageChange}
          />
        </Grid>
      </Grid>
    </NewWrapper>
  );
}

const NewWrapper = styled(Wrapper)`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
`;

export default CreateBoard;
